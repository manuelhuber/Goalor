package de.manuelhuber.purpose.features.goals

import com.google.inject.Inject
import de.manuelhuber.purpose.features.aspects.AspectService
import de.manuelhuber.purpose.features.auth.models.NotAuthorized
import de.manuelhuber.purpose.features.goals.model.Goal
import de.manuelhuber.purpose.features.goals.model.GoalData
import de.manuelhuber.purpose.features.goals.engine.GoalsEngine
import de.manuelhuber.purpose.lib.engine.Id
import de.manuelhuber.purpose.lib.exceptions.NotFound
import de.manuelhuber.purpose.lib.exceptions.ValidationError

class GoalService @Inject constructor(private val engine: GoalsEngine,
                                      private val aspectsService: AspectService) {

    fun createNewGoal(create: GoalData, owner: Id): Goal {
        validateGoal(create, owner)
        return engine.create(Goal.fromData(create, owner.value))
    }

    fun getGoalsByOwner(ownerId: Id): List<Goal> {
        return engine.getAllForOwner(ownerId.value)
    }

    fun deleteGoal(id: Id, updaterId: Id): Boolean {
        checkAuthorization(engine.get(id), updaterId)
        return engine.delete(id)
    }

    fun updateGoal(id: Id, update: GoalData, updaterId: Id): Goal {
        val goal = engine.get(id)
        checkAuthorization(goal, updaterId)
        validateGoal(update, updaterId)
        return engine.update(id, Goal.fromData(update, updaterId.value))
    }

    private fun checkAuthorization(goal: Goal, updaterId: Id) {
        if (goal.owner != updaterId.value) {
            throw NotAuthorized("You're not the owner of the goal id=${goal.id}")
        }
    }

    private fun getParentDiffs(update: Goal): List<Goal> {
        val current = engine.get(update.id)
        val modifiedGoals = mutableListOf<Goal>()
        if (current.parent == update.parent) {
            return modifiedGoals
        }
        if (current.parent != null) {
            val oldParent = engine.get(current.parent)
            val updatedChildren = oldParent.children.filter { id -> id != current.id }
            oldParent.copy(children = updatedChildren)
        }
        if (update.parent != null) {
            val newParent = engine.get(update.parent)
            val updatedChildren = newParent.children + update.parent
            newParent.copy(children = updatedChildren)
        }
        return modifiedGoals
    }

    private fun validateGoal(goal: GoalData, owner: Id) {
        val goalMustExist = mutableListOf<Id>()
        if (goal.parent != null) {
            goalMustExist.add(goal.parent)
        }
        goalMustExist.addAll(goal.children)

        try {
            engine.get(goalMustExist).forEach {
                if (it.owner != owner.value)
                    throw ValidationError("You're referencing a goal id=${it.id} of which you're not the owner")
            }
        } catch (e: NotFound) {
            throw ValidationError("You're referencing a goal id=${e.id} that doesn't exist")
        }

        try {
            if (aspectsService.getAspects(Id(goal.aspect)).owner != owner.value) {
                throw ValidationError("You're referencing an aspect id=${goal.aspect} of which you're not the owner")
            }
        } catch (e: NotFound) {
            throw ValidationError("You're referencing an aspect id=${e.id} that doesn't exist")
        }
    }

}
