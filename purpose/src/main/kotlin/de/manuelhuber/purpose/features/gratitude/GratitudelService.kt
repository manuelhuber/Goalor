package de.manuelhuber.purpose.features.gratitude

import com.google.inject.Inject
import com.google.inject.name.Named
import de.manuelhuber.purpose.app.STATIC_FILE_FOLDER
import de.manuelhuber.purpose.features.auth.checkOwnership
import de.manuelhuber.purpose.features.gratitude.engine.GratitudePostgresEngine
import de.manuelhuber.purpose.features.gratitude.model.Gratitude
import de.manuelhuber.purpose.lib.engine.Id
import io.javalin.core.util.FileUtil
import io.javalin.http.UploadedFile
import java.io.File
import java.io.IOException
import java.util.*

class GratitudeService @Inject constructor(private val engine: GratitudePostgresEngine,
                                           @Named(STATIC_FILE_FOLDER)
                                           private val imageRootPath: String) {

    private val dir = File(imageRootPath).resolve("image")

    fun createGratitude(data: GratitudeData, image: UploadedFile?, owner: Id): Gratitude {
        val path = System.getenv(STATIC_FILE_FOLDER)
        val imageId = try {
            image?.let {
                if (!dir.exists()) {
                    dir.mkdirs()
                }
                val filename = UUID.randomUUID().toString() + it.extension
                val imageFile = dir.resolve(filename)

                FileUtil.streamToFile(it.content, imageFile.absolutePath)
                filename
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
