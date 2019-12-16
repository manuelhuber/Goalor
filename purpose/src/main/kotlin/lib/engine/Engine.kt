package lib.engine

interface Engine<T : Model> {
    fun get(id: String): T
    fun create(update: T): T
    fun update(id: String, model: T): T
}
