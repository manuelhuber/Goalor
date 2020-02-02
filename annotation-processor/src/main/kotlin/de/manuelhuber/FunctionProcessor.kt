package de.manuelhuber

import com.squareup.kotlinpoet.*
import de.manuelhuber.annotations.Authorized
import de.manuelhuber.annotations.Delete
import de.manuelhuber.annotations.FileUpload
import de.manuelhuber.annotations.Post
import io.javalin.http.Context
import io.javalin.http.UploadedFile
import io.javalin.plugin.openapi.annotations.*
import javax.annotation.processing.ProcessingEnvironment
import javax.lang.model.element.ExecutableElement
import javax.lang.model.type.MirroredTypeException
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
    private val fileName = "file"
    private val ctx = "ctx" // name of the javalin.context variable

    private val authorized = func.getAnnotation(Authorized::class.java) != null

    private val status = when (annotation.annotation) {
        is Delete -> "204"
        is Post -> "201"
        else -> "200"
    }

    fun generateFunction(): Pair<FunSpec, CodeBlock>? {
        val functionName = func.simpleName.toString() // Name of the annotated function
        val wrapperFunctionName = "${functionName}Endpoint" // Name of the generated function
        val wrapper = FunSpec.builder(wrapperFunctionName)
            .addParameter(ctx, Context::class)

        val callParams = mutableListOf<String>()
        val returnType = fixTypes(func.returnType.asTypeName())

        if (func.parameters.size > maxParamCount) {
            processingEnv.messager.printMessage(
                    Diagnostic.Kind.ERROR,
                    "function ${func.simpleName} has too many parameters\n")
            return null
        }

        // First Parameter must be javalin context (or nothing)
        if (func.parameters.size > 0) {
            val firstParam = func.parameters[0]
            if (firstParam.asType().asTypeName().toString() != Context::class.qualifiedName) {
                processingEnv.messager.printMessage(
                        Diagnostic.Kind.ERROR,
                        "function ${func.simpleName} has wrong parameters: First parameter should be Javalin context\n")
                return null
            }
            callParams.add(ctx)
        }

        // endpoints that accept file uploads receive the file as 2nd parameter
        if (fileUpload) {
            if (func.parameters.size < 2 ||
                    func.parameters[1].asType().asTypeName().toString() != UploadedFile::class.qualifiedName) {
                processingEnv.messager.printMessage(
                        Diagnostic.Kind.ERROR,
                        "function ${func.simpleName} has wrong parameters: Second parameter should be UploadedFile\n")
                return null
            }
            callParams.add("$ctx.uploadedFile(\"$fileName\")")
        }

        var inputType: TypeName? = null
        if (func.parameters.size == maxParamCount) {
            inputType = fixTypes(func.parameters[maxParamCount - 1].asType().asTypeName())
            wrapper.addStatement("val input = $ctx.body<%T>()", inputType) // Read request body from context
            callParams.add("input") // pass it on to actual function
        }

        wrapper.addAnnotation(getSwaggerAnnotation(
                returnType,
                inputType,
                listOf(rootPath.removePrefix("/").removeSuffix("/"))))

        wrapper.addStatement("val res = %M.${functionName}(${callParams.joinToString(", ")})", controllerMember)

        wrapper.addStatement("$ctx.status($status)")

        if (annotation.annotation !is Delete) {
            wrapper.addStatement("$ctx.json(res)")
        }

        val authCode = CodeBlock.of(", %M(%L)",
                MemberName("io.javalin.core.security.SecurityUtil", "roles"),
                MemberName("de.manuelhuber.annotations", "Roles.USER"))

        val routeRegistration = CodeBlock.of("%M(%S, this::${wrapperFunctionName}%L)",
                annotation.routeFunction,
                path,
                if (authorized) authCode else "")

        return Pair(wrapper.build(), routeRegistration)
    }

    private fun getSwaggerAnnotation(responseType: TypeName,
                                     requestType: TypeName?,
                                     tags: List<String>): AnnotationSpec {
        val tagsString = tags.joinToString(", ") { s -> "\"${s}\"" }
        val annotation = AnnotationSpec.builder(OpenApi::class).addMember("tags = [%L]", tagsString)

        val response = responseAnnotation(responseType)
        annotation.addMember("responses = [%L]", response)

        if (requestType != null) {
            annotation.addMember("requestBody = %L", requestBodyAnnotation(requestType))
        }

        if (this.annotation.queryParams.isNotEmpty()) {
            // This is some weird shit:
            //https://area-51.blog/2009/02/13/getting-class-values-from-annotations-in-an-annotationprocessor/
            val getType = { it: OpenApiParam ->
                try {
                    it.type
                } catch (e: MirroredTypeException) {
                    e.typeMirror
                }
            }
            val queryParams = this.annotation.queryParams.map {
                AnnotationSpec.builder(OpenApiParam::class)
                    .addMember("name = \"%L\"", it.name)
                    .addMember("type = %T::class", getType(it))
                    .build()
            }
            val paramsString = queryParams.map { "%L" }.joinToString(", ")
            annotation.addMember("queryParams = [${paramsString}]", *queryParams.toTypedArray())
        }

        if (fileUpload) {
            val fileUploadAnnotation = AnnotationSpec
                .builder(OpenApiFileUpload::class)
                .addMember("name = %S", fileName)
                .build()
            annotation.addMember("fileUploads = [%L]", fileUploadAnnotation)
        }
        return annotation.build()
    }

    private fun requestBodyAnnotation(requestType: TypeName): AnnotationSpec {
        val requestContent = AnnotationSpec
            .builder(OpenApiContent::class)
            .addMember("from = %T::class", requestType)
            .build()
        return AnnotationSpec
            .builder(OpenApiRequestBody::class)
            .addMember("content = [%L]", requestContent)
            .build()
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
