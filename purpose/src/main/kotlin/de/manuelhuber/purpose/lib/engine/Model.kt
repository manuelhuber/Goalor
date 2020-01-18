package de.manuelhuber.purpose.lib.engine

interface Model {
    val id: Id
}

inline class Id(val value: String) {
    override fun toString(): String {
        return value
    }
}

fun String.toId(): Id = Id(this)
