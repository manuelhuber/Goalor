package de.manuelhuber.purpose.lib.engine

import de.manuelhuber.purpose.lib.exceptions.ValidationError
import java.util.*

interface Model {
    val id: Id
}

inline class Id(val value: String)

fun String.toId(): Id = Id(this)

fun Id.toUUID(): UUID = try {
    UUID.fromString(this.value)
} catch (e: NumberFormatException) {
    throw ValidationError("Invalid ID=${this.value} given")
}

fun UUID.toId() = Id(this.toString())
