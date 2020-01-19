package de.manuelhuber.purpose.features.gratitude

import com.google.inject.Inject
import com.google.inject.name.Named
import de.manuelhuber.purpose.app.STATIC_FILE_FOLDER
import de.manuelhuber.purpose.features.gratitude.engine.GratitudePostgresEngine
import de.manuelhuber.purpose.features.gratitude.model.Gratitude
import de.manuelhuber.purpose.lib.engine.Id
import io.javalin.core.util.FileUtil
import io.javalin.http.UploadedFile
import java.io.File
import java.io.IOException
import java.util.*

class GratitudeService @Inject constructor(private val engine: GratitudePostgresEngine,
                                           @Named(STATIC_FILE_FOLDER) private val imageRootPath: String) {

    fun createGratitude(data: GratitudeData, image: UploadedFile?, owner: Id): Gratitude {
        val path = System.getenv(STATIC_FILE_FOLDER)
        val imageId = try {
            image?.let {
                val dir = File(imageRootPath).resolve("image")
                if (!dir.exists()) {
                    dir.mkdirs()
                }
                val filename = UUID.randomUUID().toString() + it.extension
                val imageFile = dir.resolve(filename)

                FileUtil.streamToFile(it.content, imageFile.absolutePath)
                filename
            }
        } catch (e: IOException) {
            null
        }
        val gratitude = Gratitude(Id(""), owner, data.title, data.date, data.description, imageId)
        return engine.create(gratitude)
    }

    fun getGoalsByOwner(ownerId: Id): List<Gratitude> {
        return engine.getAllForOwner(ownerId)
    }
//
//    fun deleteGoal(id: Id, updaterId: Id): Boolean {
//        checkAuthorization(engine.get(id), updaterId)
//        return engine.delete(id)
//    }
//
//    fun updateGoal(id: Id, update: GoalData, updaterId: Id): Goal {
//        val goal = engine.get(id)
//        checkAuthorization(goal, updaterId)
//        validateGoal(update, updaterId, id)
//        return engine.update(id, Goal.fromData(update, updaterId.value))
//    }
//
//    private fun checkAuthorization(goal: Goal, updaterId: Id) {
//        if (goal.owner != updaterId) {
//            throw Forbidden("You're not the owner of the goal id=${goal.id}")
//        }
//    }
//
//    private fun validateGoal(goal: GoalData, owner: Id, goalId: Id? = null) {
//        if (goalId != null && (goal.parent == goalId.value || goal.children.contains(goalId.value))) {
//            throw ValidationError("A goal can't be it's own child/parent")
//        }
//        val goalMustExist = mutableListOf<Id>()
//        if (goal.parent != null) {
//            goalMustExist.add(goal.parent.toId())
//        }
//        goalMustExist.addAll(goal.children.map(String::toId))
//
//        try {
//            engine.get(goalMustExist).forEach {
//                if (it.owner != owner)
//                    throw ValidationError("You're referencing a goal id=${it.id} of which you're not the owner")
//            }
//        } catch (e: NotFound) {
//            throw ValidationError("You're referencing a goal id=${e.id} that doesn't exist")
//        }
//
//        try {
//            if (goal.aspect != null && aspectsService.getAspects(Id(goal.aspect)).owner != owner) {
//                throw ValidationError("You're referencing an aspect id=${goal.aspect} of which you're not the owner")
//            }
//        } catch (e: NotFound) {
//            throw ValidationError("You're referencing an aspect id=${e.id} that doesn't exist")
//        }
//    }

}
