package de.manuelhuber.purpose.features.aspects.engine

import de.manuelhuber.purpose.features.aspects.model.Aspect
import de.manuelhuber.purpose.lib.engine.Id
import de.manuelhuber.purpose.lib.exceptions.NotFound
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.statements.UpdateBuilder
import org.jetbrains.exposed.sql.transactions.transaction

class AspectsPostgresEngine : AspectsEngine {
    override fun getAllForOwner(owner: Id): List<Aspect> {
        return transaction {
            Aspects.select { Aspects.owner eq owner.value.toInt() }.map(rowToAspect)
        }
    }

    override fun get(id: Id): Aspect {
        return transaction {
            Aspects.select { Aspects.id eq id.value.toInt() }
                .map(rowToAspect).firstOrNull()
                    ?: throw NotFound(id.value, Aspect::class)
        }
    }

    override fun get(ids: List<Id>): List<Aspect> {
        val intIds = ids.map { it.value.toInt() }
        return transaction { Aspects.select { Aspects.id inList intIds }.map(rowToAspect) }
    }

    override fun create(model: Aspect): Aspect {
        val id = transaction { Aspects.insertAndGetId(fillColumns(model)) }
        return model.copy(id = Id(id.toString()))
    }

    override fun update(id: Id, model: Aspect): Aspect {
        transaction { Aspects.update({ Aspects.id eq id.value.toInt() }, body = fillColumns(model)) }
        return model.copy()
    }

    override fun delete(id: Id): Boolean {
        return transaction { Aspects.deleteWhere { Aspects.id eq id.value.toInt() } == 1 }
    }
}

val rowToAspect: (ResultRow) -> Aspect = {
    Aspect(
            id = Id(it[Aspects.id].toString()),
            name = it[Aspects.name],
            weight = it[Aspects.weight],
            color = it[Aspects.color],
            completed = it[Aspects.completed],
            owner = Id(it[Aspects.owner].toString())
    )
}

private fun fillColumns(aspect: Aspect): Aspects.(UpdateBuilder<Int>) -> Unit = {
    it[name] = aspect.name
    it[weight] = aspect.weight
    it[color] = aspect.color
    it[completed] = aspect.completed
    it[owner] = aspect.owner.value.toInt()
}
