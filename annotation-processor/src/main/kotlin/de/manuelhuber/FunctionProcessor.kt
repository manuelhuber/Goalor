package de.manuelhuber

import com.squareup.kotlinpoet.*
import de.manuelhuber.annotations.*
import io.javalin.http.Context
import io.javalin.http.UploadedFile
import io.javalin.plugin.openapi.annotations.*
import javax.annotation.processing.ProcessingEnvironment
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

    private val fileUpload = func.getAnnotation(FileUpload::class.java) != null
    // Params are either nothing or:
    // Javalin Context, Uploaded File (optional), request body
    private val maxParamCount = if (fileUpload) 3 else 2
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
                param.getAnnotation(BodyParam::class.java) != null -> {
                    hasBodyParam = true
                    addRequestBodyParam(param)
                }
                else -> {
                    if (!hasBodyParam) {
                        // Assume that the one un-annotated param is the body request
                        hasBodyParam = true
                        addRequestBodyParam(param)
                    } else {
                        throw Exception("Unexpected parameter. Please annotate them properly")
                    }
                }
            }
            callParams.add(paramName)
        }

        if (queryParamSwaggers.isNotEmpty()) {
            val paramsString = queryParamSwaggers.map { "%L" }.joinToString(", ")
            swagger.addMember("queryParams = [${paramsString}]", *queryParamSwaggers.toTypedArray())
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

    private fun addRequestBodyParam(param: VariableElement): String {
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
        generatedCode.addStatement("val $variableNamed = $ctx.body<%T>()", requestBodyType)
        return variableNamed
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