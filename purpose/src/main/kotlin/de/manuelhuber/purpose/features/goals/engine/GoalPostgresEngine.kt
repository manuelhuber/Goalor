package de.manuelhuber.purpose.features.goals.engine

import de.manuelhuber.purpose.features.goals.engine.GoalRelations.child
import de.manuelhuber.purpose.features.goals.engine.Goals.aspectId
import de.manuelhuber.purpose.features.goals.engine.Goals.description
import de.manuelhuber.purpose.features.goals.engine.Goals.done
import de.manuelhuber.purpose.features.goals.engine.Goals.image
import de.manuelhuber.purpose.features.goals.engine.Goals.ownerId
import de.manuelhuber.purpose.features.goals.engine.Goals.title
import de.manuelhuber.purpose.features.goals.model.Goal
import de.manuelhuber.purpose.lib.engine.Id
import de.manuelhuber.purpose.lib.exceptions.NotFound
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.statements.UpdateBuilder
import org.jetbrains.exposed.sql.transactions.transaction

class GoalPostgresEngine() : GoalsEngine {

    override fun getAllForOwner(owner: Id): List<Goal> {
        return transaction { queryGoals { ownerId eq owner.value.toInt() } }
    }

    override fun get(id: Id): Goal {
        return transaction {
            queryGoals { Goals.id eq id.value.toInt() }.firstOrNull() ?: throw NotFound(id.value, Goal::class)
        }
    }

    override fun get(ids: List<Id>): List<Goal> {
        val intIds = ids.map { it.value.toInt() }
        return transaction { queryGoals { Goals.id inList intIds } }
    }

    override fun create(model: Goal): Goal {
        val id = transaction {
            val newId = Goals.insertAndGetId(fillColumns(model))
            if (model.parent != null) {
                GoalRelations.insert {
                    it[child] = newId.value
                    it[parent] = model.parent.value.toInt()
                }
            }
            model.children.forEach { childId ->
                GoalRelations.insert {
                    it[parent] = newId.value
                    it[child] = childId.value.toInt()
                }
            }
            newId
        }
        return model.copy(id = Id(id.toString()))
    }

    override fun update(id: Id, model: Goal): Goal {
        transaction {
            Goals.update({ Goals.id eq id.value.toInt() },
                    body = fillColumns(model))
        }
        return model.copy()
    }

    override fun delete(id: Id): Boolean {
        return transaction { Goals.deleteWhere { Goals.id eq id.value.toInt() } == 1 }
    }

    private fun queryGoals(where: SqlExpressionBuilder.() -> Op<Boolean>): List<Goal> {
        return Goals.select(where = where).map { it ->
            Goal(
                    id = Id(it[Goals.id].toString()),
                    owner = Id(it[ownerId].toString()),
                    title = it[title],
                    aspect = it[aspectId]?.let { id -> Id(id.toString()) },
                    done = it[done],
                    image = it[image],
                    description = it[description]
            )
        }.map { goal ->
            val parent = GoalRelations.select { child eq goal.id.value.toInt() }.map { it[GoalRelations.parent] }
                .firstOrNull()
            val children = GoalRelations.select { GoalRelations.parent eq goal.id.value.toInt() }
                .map { Id(it[child].toString()) }
            goal.copy(parent = parent?.let { Id(it.toString()) }, children = children)
        }
    }
}

private fun fillColumns(model: Goal): Goals.(UpdateBuilder<Int>) -> Unit = {
    it[ownerId] = model.owner.value.toInt()
    it[title] = model.title
    it[aspectId] = model.aspect?.value?.toInt()
    it[done] = model.done
    it[image] = model.image
    it[description] = model.description
}
