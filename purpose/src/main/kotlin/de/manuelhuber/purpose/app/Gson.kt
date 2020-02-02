package de.manuelhuber.purpose.app

import com.google.gson.*
import de.manuelhuber.purpose.lib.engine.Id
import java.lang.reflect.Type
import java.time.LocalDate
import java.time.format.DateTimeFormatter


/**
 * Serialises id as a simple string
 */
object IdAdapter : JsonSerializer<Id> {
    override fun serialize(src: Id?, typeOfSrc: Type?, context: JsonSerializationContext?): JsonElement {
        return src?.let { JsonPrimitive(it.value) } ?: JsonNull.INSTANCE
    }
}

object LocalDateAdapter : JsonSerializer<LocalDate?> {
    override fun serialize(src: LocalDate?, typeOfSrc: Type?, context: JsonSerializationContext?): JsonElement {
        return JsonPrimitive(src?.format(DateTimeFormatter.ISO_LOCAL_DATE)) // "yyyy-mm-dd"
    }
}

object LocalDateDeserializerAdapter : JsonDeserializer<LocalDate?> {
    override fun deserialize(json: JsonElement?, typeOfT: Type?, context: JsonDeserializationContext?): LocalDate? {
        return json?.let { LocalDate.parse(it.asString, DateTimeFormatter.ISO_LOCAL_DATE) }
    }
}

fun getGson(): Gson {
    return GsonBuilder().registerTypeAdapter(Id::class.java, IdAdapter)
        .registerTypeAdapter(LocalDate::class.java, LocalDateAdapter)
        .registerTypeAdapter(LocalDate::class.java, LocalDateDeserializerAdapter)
        .create()
}
