package de.manuelhuber.purpose.lib.exceptions

import kotlin.reflect.KClass

class NotFound(val id: String, private val type: KClass<out Any>, private val idName: String = "id") : Exception() {
    override val message: String?
        get() = "No ${type.simpleName} with $idName '$id' found"
}
