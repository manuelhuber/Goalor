package de.manuelhuber.purpose.features.goals

import de.manuelhuber.purpose.features.aspects.Goal
import de.manuelhuber.purpose.features.aspects.model.GoalsEngine
import de.manuelhuber.purpose.lib.exceptions.NotFound

class GoalsEngineLocal : GoalsEngine {
    private val goals = hashMapOf(
            "1" to Goal(id = "1",
                    title = "Create this site",
                    aspect = "0",
                    children = listOf("3", "4", "6"),
                    owner = "0"),
            "2" to Goal(id = "2", aspect = "3", title = "Learn Violine", children = listOf("5"), owner = "0"),
            "3" to Goal(id = "3", parent = "1", title = "Setup React boilerplate", aspect = "0", owner = "0"),
            "4" to Goal(id = "4", parent = "1", title = "Add redux", aspect = "0", children = listOf(), owner = "0"),
            "5" to Goal(id = "5", parent = "2", title = "Design a My-GoalCard page", aspect = "0", owner = "0"),
            "6" to Goal(id = "6", parent = "1", title = "Refactoring / Cleanup", aspect = "0", owner = "0")
    )

    var id = 10

    override fun getAllForOwner(owner: String): List<Goal> {
        return goals.values.filter { it.owner == owner }
    }


    override fun get(id: String): Goal {
        return goals[id] ?: throw NotFound(id, Goal::class)
    }

    override fun get(ids: List<String>): List<Goal> {
        return ids.map(::get)
    }

    override fun delete(id: String): Boolean {
        val removed = goals.remove(id)
        return removed == null
    }

    override fun create(model: Goal): Goal {
        val m = model.copy(id = id++.toString())
        goals[m.id] = m
        return m
    }

    override fun update(id: String, model: Goal): Goal {
        if (!goals.containsKey(id)) {
            throw NotFound(id, Goal::class)
        }
        goals[id] = model
        return model
    }

}
