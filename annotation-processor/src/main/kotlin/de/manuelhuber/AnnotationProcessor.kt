package de.manuelhuber

import com.google.auto.service.AutoService
import com.squareup.kotlinpoet.MemberName
import de.manuelhuber.annotations.APIConfig
import de.manuelhuber.annotations.APIController
import javax.annotation.processing.*
import javax.lang.model.SourceVersion
import javax.lang.model.element.ElementKind
import javax.lang.model.element.TypeElement
import javax.tools.Diagnostic

@AutoService(Processor::class)
@SupportedSourceVersion(SourceVersion.RELEASE_8)
@SupportedOptions(AnnotationProcessor.KAPT_KOTLIN_GENERATED_OPTION_NAME)
class AnnotationProcessor : AbstractProcessor() {

    companion object {
        const val KAPT_KOTLIN_GENERATED_OPTION_NAME = "kapt.kotlin.generated"
        val post = MemberName("io.javalin.apibuilder.ApiBuilder", "post")
        val get = MemberName("io.javalin.apibuilder.ApiBuilder", "get")
        val put = MemberName("io.javalin.apibuilder.ApiBuilder", "put")
        val delete = MemberName("io.javalin.apibuilder.ApiBuilder", "delete")
    }

    override fun getSupportedAnnotationTypes(): MutableSet<String> = mutableSetOf(
            APIController::class.java.name,
            APIConfig::class.java.name)

    override fun getSupportedSourceVersion(): SourceVersion = SourceVersion.latest()

    override fun process(annotations: MutableSet<out TypeElement>?, roundEnv: RoundEnvironment): Boolean {
        roundEnv.getElementsAnnotatedWith(APIController::class.java).forEach {
            if (it.kind != ElementKind.CLASS) {
                processingEnv.messager.printMessage(
                        Diagnostic.Kind.ERROR,
                        "Only classes can be annotated with ${APIController::class.simpleName}"
                )
                return false
            }
            ControllerProcessor(processingEnv, it).processAnnotation()
        }
        return false
    }
}
