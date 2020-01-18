package de.manuelhuber.purpose.app

import com.google.gson.*
import de.manuelhuber.purpose.lib.engine.Id
import java.lang.reflect.Type

/**
 * Serialises id as a simple string
 */
object IdAdapter : JsonSerializer<Id> {
    override fun serialize(src: Id?, typeOfSrc: Type?, context: JsonSerializationContext?): JsonElement {
        return src?.let { JsonPrimitive(it.value) } ?: JsonNull.INSTANCE
    }
}

fun getGson(): Gson {
    return GsonBuilder()
        .registerTypeAdapter(Id::class.java, IdAdapter)
        .create()
}
