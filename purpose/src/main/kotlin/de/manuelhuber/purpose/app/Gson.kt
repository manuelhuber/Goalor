package de.manuelhuber.purpose.app

import com.google.gson.*
import de.manuelhuber.purpose.lib.engine.Id
import java.lang.reflect.Type

/**
 * Serialises
 */
object IdAdapter : JsonSerializer<Id> {
    override fun serialize(src: Id?, typeOfSrc: Type?, context: JsonSerializationContext?): JsonElement {
        return src?.let { JsonPrimitive(it.value) } ?: JsonNull.INSTANCE
    }
}
//
//object IdAdapterDe : JsonDeserializer<Id> {
//    override fun deserialize(json: JsonElement?, typeOfT: Type?, context: JsonDeserializationContext?): Id {
//        return src?.let { JsonPrimitive(it.value) } ?: JsonNull.INSTANCE
//    }
//}

fun getGson(): Gson {
    val gson = GsonBuilder()
        .registerTypeAdapter(Id::class.java, IdAdapter)
        .create()

    return gson
}
