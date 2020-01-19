package de.manuelhuber

import com.squareup.kotlinpoet.ClassName
import com.squareup.kotlinpoet.ParameterizedTypeName
import com.squareup.kotlinpoet.ParameterizedTypeName.Companion.parameterizedBy
import com.squareup.kotlinpoet.STRING
import com.squareup.kotlinpoet.TypeName

fun joinPaths(root: String, end: String): String {
    val final = StringBuilder()
    if (!root.isBlank()) {
        if (!root.startsWith("/")) final.append("/")
        final.append(root)
    }
    if (!end.startsWith("/")) final.append("/")
    final.append(end)
    return final.toString().replace("//", "/")
}

/**
 * Fixes types that get messed up between java and kotlin
 */
fun fixTypes(typeName: TypeName): TypeName {
    if (typeName.toString() == "java.lang.String") {
        return STRING
    } else if (typeName is ParameterizedTypeName) {
        if (typeName.rawType.toString() == "java.util.List") {
            val array = ClassName("kotlin", "Array")
            return array.parameterizedBy(typeName.typeArguments)
        }
    }
    return typeName
}
