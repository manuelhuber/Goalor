package de.manuelhuber.purpose.lib.engine

interface Engine<T : Model> {
    fun get(id: Id): T
    fun get(ids: List<Id>): List<T>
    fun create(model: T): T
    fun update(id: Id, model: T): T
    fun delete(id: Id): Boolean
}
