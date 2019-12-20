package de.manuelhuber.purpose.lib.engine

import kotlin.reflect.KClass

class NotFound(val id: String, val type: KClass<out Any>, val idName: String = "id") : Exception() {
    override val message: String?
        get() = "No ${type.simpleName} with $idName '$id' found"
}
