package de.manuelhuber.purpose.lib.engine

interface Model {
    val id: Id
}

inline class Id(val value: String)
