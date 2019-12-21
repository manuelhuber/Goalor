package de.manuelhuber.purpose.lib.engine

interface Engine<T : Model> {
    fun get(id: String): T
    fun create(model: T): T
    fun update(id: String, model: T): T
    fun delete(id: String): Boolean
}
