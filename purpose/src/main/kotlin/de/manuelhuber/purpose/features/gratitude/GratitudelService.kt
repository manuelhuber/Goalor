package de.manuelhuber.purpose.features.gratitude

import com.google.inject.Inject
import com.google.inject.name.Named
import de.manuelhuber.purpose.app.STATIC_FILE_FOLDER
import de.manuelhuber.purpose.features.auth.checkOwnership
import de.manuelhuber.purpose.features.gratitude.engine.GratitudePostgresEngine
import de.manuelhuber.purpose.features.gratitude.model.Gratitude
import de.manuelhuber.purpose.lib.engine.Id
import de.manuelhuber.purpose.lib.files.writeCompressed
import io.javalin.http.UploadedFile
import java.io.File
import java.io.IOException
import java.util.*

class GratitudeService @Inject constructor(private val engine: GratitudePostgresEngine,
                                           @Named(STATIC_FILE_FOLDER)
                                           private val imageRootPath: String) {

    private val dir = File(imageRootPath).resolve("image")

    fun createGratitude(data: GratitudeData, image: UploadedFile?, owner: Id): Gratitude {
        val imageId = try {
            image?.let {
                if (!dir.exists()) {
                    dir.mkdirs()
                }
                val filename = UUID.randomUUID().toString() + it.extension
                val compressed =
                        writeCompressed(it.content,
                                dir.resolve(filename).absolutePath,
                                0.4f,
                                it.extension.trimStart('.'))
                compressed.name
            }
        } catch (e: IOException) {
            throw Exception("Error saving file")
        }
        val gratitude = Gratitude.fromData(data, owner, imageId)
        return engine.create(gratitude)
    }

    fun getGoalsByOwner(ownerId: Id): List<Gratitude> {
        return engine.getAllForOwner(ownerId)
    }

    fun deleteGratitude(id: Id, updaterId: Id): Boolean {
        val model = engine.get(id)
        checkOwnership(model, updaterId)
        if (model.image != null) {
            try {
                dir.resolve(model.image).delete()
            } catch (e: SecurityException) {

            }
        }
        return engine.delete(id)
    }

    fun updateGoal(id: Id, update: GratitudeData, updaterId: Id): Gratitude {
        val model = engine.get(id)
        checkOwnership(model, updaterId)
        return engine.update(id, Gratitude.fromData(update, updaterId, model.image))
    }


}
