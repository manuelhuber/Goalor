@file:Suppress("JAVA_MODULE_DOES_NOT_EXPORT_PACKAGE")

package de.manuelhuber

import com.squareup.kotlinpoet.*
import com.sun.tools.javac.code.Symbol
import com.sun.tools.javac.code.Type
import de.manuelhuber.annotations.*
import io.javalin.http.Context
import io.javalin.http.UploadedFile
import io.javalin.plugin.openapi.annotations.*
import org.jetbrains.annotations.NotNull
import javax.annotation.processing.ProcessingEnvironment
import javax.lang.model.element.Element
import javax.lang.model.element.ExecutableElement
import javax.lang.model.element.VariableElement
import javax.tools.Diagnostic


class FunctionProcessor(private val processingEnv: ProcessingEnvironment,
                        private val annotation: AnnotationData,
                        private val func: ExecutableElement,
                        private val path: String, // the entire path of the endpoint
                        private val controllerMember: MemberName, // reference to the class property that holds the controller
                        private val rootPath: String // the base path of the endpoint (used for tagging)
) {

    private val ctx = "ctx" // name of the javalin.context variable
    private val swagger = AnnotationSpec.builder(OpenApi::class)
    private val authorized = func.getAnnotation(Authorized::class.java) != null

    private val functionName = func.simpleName.toString() // Name of the annotated function
    private val wrapperFunctionName = "${functionName}Endpoint" // Name of the generated function
    private val generatedCode = FunSpec.builder(wrapperFunctionName)

    private val status = when (annotation.annotation) {
        is Delete -> "204"
        is Post -> "201"
        else -> "200"
    }

    fun generateFunction(): Pair<FunSpec, CodeBlock>? {
        // Javalin passes us the context
        generatedCode.addParameter(ctx, Context::class)

        val rootPathSanitised = rootPath.removePrefix("/").removeSuffix("/")
        swagger.addMember("tags = [%S]", rootPathSanitised)

        // Params
        val callParams = mutableListOf<String>()
        val queryParamSwaggers = mutableListOf<AnnotationSpec>()
        var hasBodyParam = false

        func.parameters.filterNotNull().forEach { param: VariableElement ->
            val bodyParam = param.getAnnotation(BodyParam::class.java)
            val paramName = when {
                param.asType().asTypeName().toString() == Context::class.qualifiedName -> {
                    ctx
                }
                param.getAnnotation(QueryParam::class.java) != null -> {
                    val queryParam = addQueryParam(param)
                    queryParamSwaggers.add(queryParam.second)
                    queryParam.first
                }
                param.getAnnotation(FileUpload::class.java) != null -> {
                    addFileUploadParam(param)
                }
                bodyParam != null -> {
                    hasBodyParam = true
                    addRequestBodyParam(param, bodyParam.type)
                }
                else -> {
                    if (!hasBodyParam) {
                        // Assume that the one un-annotated param is the body request
                        hasBodyParam = true
                        addRequestBodyParam(param, ContentType.AUTODETECT)
                    } else {
                        throw Exception("Unexpected parameter. Please annotate them properly")
                    }
                }
            }
            callParams.add(paramName)
        }

        if (queryParamSwaggers.isNotEmpty()) {
            val paramsPlaceholder = queryParamSwaggers.joinToString(", ") { "%L" }
            swagger.addMember("queryParams = [${paramsPlaceholder}]", *queryParamSwaggers.toTypedArray())
        }


        // Return stuff
        generatedCode.addStatement("val res = %M.${functionName}(${callParams.joinToString(", ")})", controllerMember)
        val response = responseAnnotation(fixTypes(func.returnType.asTypeName()))
        swagger.addMember("responses = [%L]", response)

        generatedCode.addStatement("$ctx.status($status)")

        if (annotation.annotation !is Delete) {
            generatedCode.addStatement("$ctx.json(res)")
        }
        generatedCode.addAnnotation(swagger.build())
        return Pair(generatedCode.build(), routeRegistration())
    }


    private fun routeRegistration(): CodeBlock {
        val authCode = CodeBlock.of(", %M(%L)",
                MemberName("io.javalin.core.security.SecurityUtil", "roles"),
                MemberName("de.manuelhuber.annotations", "Roles.USER"))

        return CodeBlock.of("%M(%S, this::$wrapperFunctionName%L)",
                annotation.routeFunction,
                path,
                if (authorized) authCode else "")
    }

    private fun addQueryParam(param: VariableElement): Pair<String, AnnotationSpec> {
        // Name of the query param - we're also using it as the name of the variable in our generated code
        var name = param.getAnnotation(QueryParam::class.java).name
        if (name.isBlank()) {
            name = param.simpleName.toString()
        }
        val paramType = fixTypes(param.asType().asTypeName())
        generatedCode.addStatement("val $name = $ctx.queryParam<%T>(%S).value!!", paramType, name)

        val swaggerInfo = AnnotationSpec.builder(OpenApiParam::class)
            .addMember("name = \"%L\"", name)
            .addMember("type = %T::class", paramType)
            .build()
        return Pair(name, swaggerInfo)
    }

    private fun addFileUploadParam(param: VariableElement): String {
        if (param.asType().asTypeName().toString() != UploadedFile::class.qualifiedName) {
            processingEnv.messager.printMessage(
                    Diagnostic.Kind.ERROR,
                    "parameter ${param.simpleName} has wrong type: should be UploadedFile\n")
            throw Exception("File upload parameters must be of type 'UploadedFile'")
        }
        val fileName = param.getAnnotation(FileUpload::class.java).name
        val fileUploadAnnotation = AnnotationSpec
            .builder(OpenApiFileUpload::class)
            .addMember("name = %S", fileName)
            .build()
        swagger.addMember("fileUploads = [%L]", fileUploadAnnotation)
        return "$ctx.uploadedFile(\"$fileName\")"
    }

    private fun addRequestBodyParam(param: VariableElement, type: String): String {
        return if (type == ContentType.FORM_DATA_MULTIPART) {
            addRequestBodyParamMultipartForm(param)
        } else {
            addRequestBodyParamJson(param)
        }
    }

    private fun addRequestBodyParamJson(param: VariableElement): String {
        val requestBodyType = fixTypes(param.asType().asTypeName())
        val requestContent = AnnotationSpec
            .builder(OpenApiContent::class)
            .addMember("from = %T::class", requestBodyType)
            .build()
        val requestBodyAnnotation = AnnotationSpec
            .builder(OpenApiRequestBody::class)
            .addMember("content = [%L]", requestContent)
            .build()
        swagger.addMember("requestBody = %L", requestBodyAnnotation)
        val variableNamed = "bodyInput"
        getRequestBody(param, variableNamed, requestBodyType)
        return variableNamed
    }

    private fun getRequestBody(param: VariableElement,
                               variableNamed: String,
                               requestBodyType: Any) {
        generatedCode.addStatement("val $variableNamed = $ctx.bodyValidator<%T>()", requestBodyType)

        processingEnv.typeUtils.asElement(param.asType()).enclosedElements.forEach {
            addChecks(it)
        }
        generatedCode.addStatement("    .get()")
    }

    private fun addChecks(it: Element) {
        val valueNotEmpty = it.getAnnotation(ValueNotEmpty::class.java) !== null
        val notEmpty = it.getAnnotation(NotEmpty::class.java) !== null
        val propName = it.simpleName

        if (valueNotEmpty || notEmpty) {
            val value = if (valueNotEmpty) ".value" else ""
            check("it.$propName$value.trim().isNotEmpty()", "$propName can't be empty")
        }

        val minLength = it.getAnnotation(MinLength::class.java)
        if (minLength !== null) {
            check("it.$propName.trim().length >= ${minLength.len}", "$propName min length ${minLength.len}")
        }
    }

    private fun addRequestBodyParamMultipartForm(param: VariableElement): String {
        val constructor =
                (param as Symbol).type.tsym.members().getSymbols().toList().findLast { symbol -> symbol.isConstructor }
        val params = (constructor as Symbol.MethodSymbol).params
        val formParamSwaggers = mutableListOf<AnnotationSpec>()
        params.forEach {
            if (it.asType().asTypeName().toString() == UploadedFile::class.qualifiedName) {
                val file = addFileUploadParam(it)
                val nonNull = if (it.getAnnotation(NotNull::class.java) == null) "" else "!!"
                generatedCode.addStatement("val ${it.name}FormParam = $file$nonNull", it.name)
            } else {
                formParamSwaggers.add(addFormParam(it))
            }
        }
        val formParamPlaceholders = formParamSwaggers.joinToString(", ") { "%L" }
        swagger.addMember("formParams = [$formParamPlaceholders]", *formParamSwaggers.toTypedArray())
        val variableNamed = "formInput"
        val paramsNamed = params.map { "${it.name}FormParam" }.joinToString(", ")
        val clazzName = (param.type as Type).asElement().name
        generatedCode.addStatement("val $variableNamed = ${clazzName}($paramsNamed)")
        return variableNamed
    }

    private fun addFormParam(it: Symbol.VarSymbol): AnnotationSpec {
        val paramType = fixTypes(it.type.asTypeName())
        val formParam = AnnotationSpec.builder(OpenApiFormParam::class)
            .addMember("name = %S", it.name)
            .addMember("type = %T::class", paramType)
            .build()
        generatedCode.addStatement("val ${it.name}FormParam = $ctx.formParam(%S, %T::class.java)",
                it.name,
                paramType)
        addChecks(it)
        generatedCode.addStatement("    .get()")
        return formParam
    }

    private fun check(predicate: String, error: String) {
        generatedCode.addStatement("""
                    |   .check(
                    |       predicate = { $predicate },
                    |       errorMessage = %S)
                    """.trimMargin(), error)
    }

    private fun responseAnnotation(responseType: TypeName): AnnotationSpec {
        val response = AnnotationSpec
            .builder(OpenApiResponse::class)
            .addMember("status = %S", status)

        if (annotation.annotation !is Delete) {
            val responseContent = AnnotationSpec
                .builder(OpenApiContent::class)
                .addMember("from = %T::class", responseType)
                .build()
            response.addMember("content = [%L]", responseContent)
        }
        return response.build()
    }

}
