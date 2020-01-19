package de.manuelhuber

import com.google.inject.Inject
import com.squareup.kotlinpoet.*
import de.manuelhuber.annotations.*
import io.javalin.Javalin
import java.io.File
import javax.annotation.processing.ProcessingEnvironment
import javax.lang.model.element.Element
import javax.lang.model.util.ElementFilter
import javax.tools.Diagnostic

class ControllerProcessor(private val processingEnv: ProcessingEnvironment,
                          private val element: Element) {

    private val name: String = element.simpleName.toString()
    private val type: TypeName = element.asType().asTypeName()
    private val pack = processingEnv.elementUtils.getPackageOf(element).toString()
    private val rootPath = element.getAnnotation(APIController::class.java).path

    fun processAnnotation() {
        processingEnv.messager.printMessage(Diagnostic.Kind.NOTE, "Processing class $name\n")

        val className = "${name}Wrapper"
        val controller = "controller" // variable name
        val controllerMember = MemberName(pack, controller)

        val classBuilder = TypeSpec
            .classBuilder(className)
            .addSuperinterface(Controller::class.java)
            .primaryConstructor(FunSpec.constructorBuilder()
                .addParameter(controller, type)
                .addAnnotation(Inject::class.java).build())
            .addProperty(PropertySpec
                .builder(controller, type)
                .addModifiers(KModifier.PRIVATE)
                .initializer(controller).build())

        val mapping = mutableListOf<CodeBlock>()

        for (func in ElementFilter.methodsIn(element.enclosedElements)) {
            val annotation = listOf(
                    func.getAnnotation(Get::class.java), func.getAnnotation(Post::class.java),
                    func.getAnnotation(Put::class.java), func.getAnnotation(Delete::class.java)
            )
                .map { annotation -> AnnotationData.fromAnnotation(annotation) }
                .firstOrNull { annotation -> annotation !== null }
            if (annotation === null) continue
            processingEnv.messager.printMessage(Diagnostic.Kind.NOTE,
                    "Processing function ${func.simpleName} in class $name\n")
            val gen = FunctionProcessor(
                    processingEnv,
                    annotation,
                    func,
                    joinPaths(rootPath, annotation.path),
                    controllerMember,
                    rootPath
            ).generateFunction()
            if (gen != null) {
                classBuilder.addFunction(gen.first)
                mapping.add(gen.second)
            }
        }

        val addRouteFun = generateRouteMapping(mapping)

        classBuilder.addFunction(addRouteFun.build())
        val kaptKotlinGeneratedDir = processingEnv.options[AnnotationProcessor.KAPT_KOTLIN_GENERATED_OPTION_NAME]
        FileSpec.builder(pack, className).addType(classBuilder.build()).build().writeTo(File(kaptKotlinGeneratedDir))
    }


    private fun generateRouteMapping(mapping: MutableList<CodeBlock>): FunSpec.Builder {
        val addRouteFun = FunSpec.builder("addRoutes")
            .addModifiers(KModifier.OVERRIDE)
            .addParameter("app", Javalin::class.java)
            .beginControlFlow("app.routes")
        mapping.forEach { b ->
            addRouteFun.addCode(b)
            addRouteFun.addStatement("") // To add a line break - there's probably a better way to do this ¯\_(ツ)_/¯
        }
        addRouteFun.endControlFlow()
        return addRouteFun
    }

}
