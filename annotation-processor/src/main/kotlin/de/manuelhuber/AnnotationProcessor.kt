package de.manuelhuber

import com.google.auto.service.AutoService
import com.google.inject.Inject
import com.squareup.kotlinpoet.*
import de.manuelhuber.annotations.APIController
import de.manuelhuber.annotations.Controller
import de.manuelhuber.annotations.Get
import de.manuelhuber.annotations.Post
import io.javalin.Javalin
import io.javalin.http.Context
import io.javalin.plugin.openapi.annotations.OpenApi
import io.javalin.plugin.openapi.annotations.OpenApiContent
import io.javalin.plugin.openapi.annotations.OpenApiRequestBody
import io.javalin.plugin.openapi.annotations.OpenApiResponse
import java.io.File
import javax.annotation.processing.*
import javax.lang.model.SourceVersion
import javax.lang.model.element.Element
import javax.lang.model.element.ElementKind
import javax.lang.model.element.ExecutableElement
import javax.lang.model.element.TypeElement
import javax.lang.model.type.TypeMirror
import javax.lang.model.util.ElementFilter
import javax.tools.Diagnostic

@AutoService(Processor::class)
@SupportedSourceVersion(SourceVersion.RELEASE_8)
@SupportedOptions(AnnotationProcessor.KAPT_KOTLIN_GENERATED_OPTION_NAME)
class AnnotationProcessor : AbstractProcessor() {

    companion object {
        const val KAPT_KOTLIN_GENERATED_OPTION_NAME = "kapt.kotlin.generated"
        val post = MemberName("io.javalin.apibuilder.ApiBuilder", "post")
        val get = MemberName("io.javalin.apibuilder.ApiBuilder", "get")

    }

    override fun getSupportedAnnotationTypes(): MutableSet<String> = mutableSetOf(APIController::class.java.name)

    override fun getSupportedSourceVersion(): SourceVersion = SourceVersion.latest()

    override fun process(annotations: MutableSet<out TypeElement>?, roundEnv: RoundEnvironment): Boolean {
        roundEnv.getElementsAnnotatedWith(APIController::class.java)
            .forEach {
                if (it.kind != ElementKind.CLASS) {
                    processingEnv.messager.printMessage(Diagnostic.Kind.ERROR, "Only classes can be annotated")
                    return true
                }
                processAnnotation(it)
            }
        return false
    }

    private fun processAnnotation(element: Element) {

        val controllerName = element.simpleName.toString()
        val controllerType = element.asType().asTypeName()
        val pack = processingEnv.elementUtils.getPackageOf(element).toString()

        processingEnv.messager.printMessage(Diagnostic.Kind.WARNING, "Processing class $controllerName\n")

        val wrapperName = "${controllerName}Wrapper"

        val controller = "controller"
        val classBuilder = TypeSpec.classBuilder(wrapperName)
            .addSuperinterface(Controller::class.java)
            .primaryConstructor(FunSpec.constructorBuilder().addParameter(controller,
                    controllerType).addAnnotation(Inject::class.java).build())
            .addProperty(PropertySpec.builder(controller,
                    controllerType).addModifiers(KModifier.PRIVATE).initializer(controller).build())
        val controllerMember = MemberName(pack, controller)

        val mapping = mutableListOf<CodeBlock>()

        for (encl in ElementFilter.methodsIn(element.enclosedElements)) {
            val annotation = listOf(encl.getAnnotation(Get::class.java), encl.getAnnotation(Post::class.java))
                .map { annotation -> AnnotationData.fromAnnotation(annotation) }
                .firstOrNull { annotation -> annotation !== null }
            if (annotation === null) continue
            processingEnv.messager.printMessage(Diagnostic.Kind.WARNING,
                    "Processing function ${encl.simpleName} in class $controllerName\n")
            val gen = generateFunction(encl, annotation.routeFunction, annotation.path, controllerMember)
            if (gen != null) {
                classBuilder.addFunction(gen.first)
                mapping.add(gen.second)
            }
        }

        val addRouteFun = generateRouteMapping(mapping)

        classBuilder.addFunction(addRouteFun.build())
        val kaptKotlinGeneratedDir = processingEnv.options[KAPT_KOTLIN_GENERATED_OPTION_NAME]
        FileSpec.builder(pack, wrapperName).addType(classBuilder.build()).build().writeTo(File(kaptKotlinGeneratedDir))
    }

    private fun generateRouteMapping(mapping: MutableList<CodeBlock>): FunSpec.Builder {
        val addRouteFun = FunSpec.builder("addRoutes")
            .addModifiers(KModifier.OVERRIDE)
            .addParameter("app", Javalin::class.java)
            .beginControlFlow("app.routes")
        mapping.forEach { b ->
            addRouteFun.addStatement("") // To add a line break - there's probably a better way
            addRouteFun.addCode(b)
        }
        addRouteFun.endControlFlow()
        return addRouteFun
    }

    private fun generateFunction(func: ExecutableElement,
                                 routeFunction: MemberName,
                                 path: String,
                                 controllerMember: MemberName): Pair<FunSpec, CodeBlock>? {
        var callParams = ""
        var inputType: TypeMirror? = null
        if (func.parameters.size > 2) {
            processingEnv.messager.printMessage(Diagnostic.Kind.ERROR,
                    "function ${func.simpleName} has more than 2 parameters\n")
            return null;
        }
        if (func.parameters.size > 0) {
            val firstParam = func.parameters[0]
            if (firstParam.asType().asTypeName().toString() != Context::class.qualifiedName) {
                processingEnv.messager.printMessage(Diagnostic.Kind.ERROR,
                        "function ${func.simpleName} has wrong parameters: First parameter should be Javalin context\n")
                return null;
            }
            callParams = "ctx"
        }
        if (func.parameters.size > 1) {
            inputType = func.parameters[1].asType()
            callParams += ", input"
        }

        val returnType = func.returnType.asTypeName()
        val functionName = func.simpleName.toString()
        val wrapperFunctionName = "${functionName}Endpoint"

        val wrapper = FunSpec.builder(wrapperFunctionName)
            .addAnnotation(getSwaggerAnnotation(returnType, inputType?.asTypeName()))
            .addParameter("ctx", Context::class)
        if (inputType !== null) {
            wrapper.addStatement("val input = ctx.body<%T>()", inputType)
        }
        wrapper.addStatement("val res = %M.${functionName}(${callParams})", controllerMember)
            .addStatement("ctx.json(res)")
        val routeRegistration = CodeBlock.of("%M(%S, this::${wrapperFunctionName})", routeFunction, path)
        return Pair(wrapper.build(), routeRegistration)
    }

    private fun getSwaggerAnnotation(responseType: TypeName, requestType: TypeName?): AnnotationSpec {
        val annotation = AnnotationSpec.builder(OpenApi::class)

        val responseContent = AnnotationSpec.builder(OpenApiContent::class).addMember("from = %T::class", responseType)
            .build()
        val response = AnnotationSpec.builder(OpenApiResponse::class)
            .addMember("status = %S", "200")
            .addMember("content = [%L]", responseContent).build()
        annotation.addMember("responses = [%L]", response)

        var request: AnnotationSpec? = null
        if (requestType != null) {
            val requestContent = AnnotationSpec.builder(OpenApiContent::class)
                .addMember("from = %T::class", requestType).build()
            request = AnnotationSpec.builder(OpenApiRequestBody::class)
                .addMember("content = [%L]", requestContent).build()
        }
        if (request != null) annotation.addMember("requestBody = %L", request)
        return annotation.build()
    }

    data class AnnotationData(val routeFunction: MemberName, val path: String) {
        companion object {
            fun fromAnnotation(x: Any?): AnnotationData? {
                return when (x) {
                    is Get -> AnnotationData(get, x.path)
                    is Post -> AnnotationData(post, x.path)
                    else -> null
                }
            }
        }
    }
}