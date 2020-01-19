package de.manuelhuber.purpose.features.gratitude

import com.google.inject.Inject
import de.manuelhuber.purpose.features.aspects.AspectService
import de.manuelhuber.purpose.features.auth.models.Forbidden
import de.manuelhuber.purpose.features.goals.engine.GoalsEngine
import de.manuelhuber.purpose.features.goals.model.Goal
import de.manuelhuber.purpose.features.goals.model.GoalData
import de.manuelhuber.purpose.lib.engine.Id
import de.manuelhuber.purpose.lib.engine.toId
import de.manuelhuber.purpose.lib.exceptions.NotFound
import de.manuelhuber.purpose.lib.exceptions.ValidationError

class GratitudelService @Inject constructor(private val engine: GoalsEngine,
                                            private val aspectsService: AspectService) {

    fun createNewGoal(create: GoalData, owner: Id): Goal {
        return engine.create(Goal.fromData(create, owner.value))
    }

    fun getGoalsByOwner(ownerId: Id): List<Goal> {
        return engine.getAllForOwner(ownerId)
    }

    fun deleteGoal(id: Id, updaterId: Id): Boolean {
        checkAuthorization(engine.get(id), updaterId)
        return engine.delete(id)
    }

    fun updateGoal(id: Id, update: GoalData, updaterId: Id): Goal {
        val goal = engine.get(id)
        checkAuthorization(goal, updaterId)
        validateGoal(update, updaterId, id)
        return engine.update(id, Goal.fromData(update, updaterId.value))
    }

    private fun checkAuthorization(goal: Goal, updaterId: Id) {
        if (goal.owner != updaterId) {
            throw Forbidden("You're not the owner of the goal id=${goal.id}")
        }
    }

    private fun validateGoal(goal: GoalData, owner: Id, goalId: Id? = null) {
        if (goalId != null && (goal.parent == goalId.value || goal.children.contains(goalId.value))) {
            throw ValidationError("A goal can't be it's own child/parent")
        }
        val goalMustExist = mutableListOf<Id>()
        if (goal.parent != null) {
            goalMustExist.add(goal.parent.toId())
        }
        goalMustExist.addAll(goal.children.map(String::toId))

        try {
            engine.get(goalMustExist).forEach {
                if (it.owner != owner)
                    throw ValidationError("You're referencing a goal id=${it.id} of which you're not the owner")
            }
        } catch (e: NotFound) {
            throw ValidationError("You're referencing a goal id=${e.id} that doesn't exist")
        }

        try {
            if (goal.aspect != null && aspectsService.getAspects(Id(goal.aspect)).owner != owner) {
                throw ValidationError("You're referencing an aspect id=${goal.aspect} of which you're not the owner")
            }
        } catch (e: NotFound) {
            throw ValidationError("You're referencing an aspect id=${e.id} that doesn't exist")
        }
    }

}
