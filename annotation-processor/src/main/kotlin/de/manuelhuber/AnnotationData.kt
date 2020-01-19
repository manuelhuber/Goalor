package de.manuelhuber

import com.squareup.kotlinpoet.MemberName
import de.manuelhuber.annotations.Delete
import de.manuelhuber.annotations.Get
import de.manuelhuber.annotations.Post
import de.manuelhuber.annotations.Put

data class AnnotationData(val routeFunction: MemberName, val path: String, val annotation: Any) {
    companion object {
        fun fromAnnotation(x: Any?): AnnotationData? {
            return when (x) {
                is Get -> AnnotationData(AnnotationProcessor.get, x.path, x)
                is Post -> AnnotationData(AnnotationProcessor.post, x.path, x)
                is Delete -> AnnotationData(AnnotationProcessor.delete, x.path, x)
                is Put -> AnnotationData(AnnotationProcessor.put, x.path, x)
                else -> null
            }
        }
    }
}
