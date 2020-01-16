package de.manuelhuber.purpose.features.goals.engine

import de.manuelhuber.purpose.features.goals.model.Goal
import de.manuelhuber.purpose.lib.engine.Id
import de.manuelhuber.purpose.lib.exceptions.NotFound

class GoalsEngineLocal : GoalsEngine {
    private val goals = hashMapOf(
            Id("1") to Goal(id = Id("1"),
                    title = "Create this site",
                    aspect = "0",
                    children = listOf(Id("3"), Id("4"), Id("6")),
                    owner = "0",
                    description = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cumque doloribus eius eligendi eum illum, itaque labore laboriosam molestias, nam nihil porro quasi? Blanditiis placeat quisquam quo! Cum mollitia nobis voluptatibus."),
            Id("2") to Goal(id = Id("2"),
                    aspect = "3",
                    title = "Learn Violine",
                    children = listOf(Id("5")),
                    owner = "0"),
            Id("3") to Goal(id = Id("3"),
                    parent = Id("1"),
                    title = "Setup React boilerplate",
                    aspect = "0",
                    owner = "0"),
            Id("4") to Goal(id = Id("4"),
                    parent = Id("1"),
                    title = "Add redux",
                    aspect = "0",
                    owner = "0",
                    description = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cumque doloribus eius eligendi eum illum, itaque labore laboriosam molestias, nam nihil porro quasi? Blanditiis placeat quisquam quo! Cum mollitia nobis voluptatibus.\n"),
            Id("5") to Goal(id = Id("5"),
                    parent = Id("2"),
                    title = "Design a My-GoalCard page",
                    aspect = "0",
                    owner = "0"),
            Id("6") to Goal(id = Id("6"), parent = Id("1"), title = "Refactoring / Cleanup", aspect = "0", owner = "0")
    )

    var id = 10

    override fun getAllForOwner(owner: String): List<Goal> {
        return goals.values.filter { it.owner == owner }
    }


    override fun get(id: Id): Goal {
        return goals[id] ?: throw NotFound(id.value, Goal::class)
    }

    override fun get(ids: List<Id>): List<Goal> {
        return ids.map(::get)
    }

    override fun delete(id: Id): Boolean {
        val removed = goals.remove(id)
        return removed == null
    }

    override fun create(model: Goal): Goal {
        val m = model.copy(id = Id(id++.toString()))
        goals[m.id] = m
        return m
    }

    override fun update(id: Id, model: Goal): Goal {
        if (!goals.containsKey(id)) {
            throw NotFound(id.value, Goal::class)
        }
        goals[id] = model
        return model
    }

}
