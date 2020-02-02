package de.manuelhuber

import com.squareup.kotlinpoet.MemberName
import de.manuelhuber.annotations.Delete
import de.manuelhuber.annotations.Get
import de.manuelhuber.annotations.Post
import de.manuelhuber.annotations.Put
import io.javalin.plugin.openapi.annotations.OpenApiParam

data class AnnotationData(val routeFunction: MemberName,
                          val path: String,
                          val annotation: Any,
                          val queryParams: Array<OpenApiParam>) {
    companion object {
        fun fromAnnotation(x: Any?): AnnotationData? {
            return when (x) {
                is Get -> AnnotationData(AnnotationProcessor.get, x.path, x, x.queryParams)
                is Post -> AnnotationData(AnnotationProcessor.post, x.path, x, x.queryParams)
                is Delete -> AnnotationData(AnnotationProcessor.delete, x.path, x, x.queryParams)
                is Put -> AnnotationData(AnnotationProcessor.put, x.path, x, x.queryParams)
                else -> null
            }
        }
    }
}
