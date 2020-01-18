package de.manuelhuber.purpose.lib.engine

import de.manuelhuber.purpose.lib.exceptions.ValidationError

interface Model {
    val id: Id
}

inline class Id(val value: String) {
    override fun toString(): String {
        return value
    }
}

fun String.toId(): Id = Id(this)

fun Id.toInt(): Int = try {
    this.value.toInt()
} catch (e: NumberFormatException) {
    throw ValidationError("Invalid ID=${this.value} given")
}
