package de.manuelhuber.purpose.features.aspects

import com.google.inject.Inject
import de.manuelhuber.purpose.features.aspects.model.GoalsEngine
import de.manuelhuber.purpose.features.auth.models.NotAuthorized
import de.manuelhuber.purpose.lib.exceptions.NotFound
import de.manuelhuber.purpose.lib.exceptions.ValidationError

class GoalService @Inject constructor(val engine: GoalsEngine, val aspectsService: AspectService) {

    fun createNewGoal(create: GoalData, owner: String): Goal {
        validateGoal(create, owner)
        return engine.create(Goal.fromData(create, owner))
    }

    fun getGoalsByOwner(ownerId: String): List<Goal> {
        return engine.getAllForOwner(ownerId)
    }

    fun deleteGoal(id: String, updaterId: String): Boolean {
        checkAuthorization(engine.get(id), updaterId)
        return engine.delete(id)
    }

    fun updateGoal(id: String, update: GoalData, updaterId: String): Goal {
        val goal = engine.get(id)
        checkAuthorization(goal, updaterId)
        validateGoal(update, updaterId)
        return engine.update(id, Goal.fromData(update, updaterId))
    }

    private fun checkAuthorization(goal: Goal, updaterId: String) {
        if (goal.owner != updaterId) {
            throw NotAuthorized("You're not the owner of the goal id=${goal.id}")
        }
    }

    private fun validateGoal(goal: GoalData, owner: String) {
        val goalMustExist = mutableListOf<String>()
        if (goal.parent != null) {
            goalMustExist.add(goal.parent)
        }
        goalMustExist.addAll(goal.children)

        try {
            engine.get(goalMustExist).forEach {
                if (it.owner != owner)
                    throw ValidationError("You're referencing a goal id=${it.id} of which you're not the owner")
            }
        } catch (e: NotFound) {
            throw ValidationError("You're referencing a goal id=${e.id} that doesn't exist")
        }

        try {
            if (aspectsService.getAspects(goal.aspect).owner != owner) {
                throw ValidationError("You're referencing an aspect id=${goal.aspect} of which you're not the owner")
            }
        } catch (e: NotFound) {
            throw ValidationError("You're referencing an aspect id=${e.id} that doesn't exist")
        }
    }

}
