package de.manuelhuber.purpose.features.gratitude.engine

import de.manuelhuber.purpose.features.gratitude.model.Gratitude
import de.manuelhuber.purpose.features.users.engine.Users
import de.manuelhuber.purpose.lib.engine.Id
import de.manuelhuber.purpose.lib.engine.toId
import de.manuelhuber.purpose.lib.engine.toUUID
import de.manuelhuber.purpose.lib.exceptions.NotFound
import org.jetbrains.exposed.dao.id.UUIDTable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.`java-time`.date
import org.jetbrains.exposed.sql.statements.UpdateBuilder
import org.jetbrains.exposed.sql.transactions.transaction

object Gratitudes : UUIDTable() {
    val owner = uuid("owner_id").references(Users.id, onDelete = ReferenceOption.CASCADE).index()
    val title = varchar("title", 150)
    val date = date("date")
    val description = text("description").nullable()
    val image_id = varchar("image_id", 150).nullable()
}

class GratitudePostgresEngine : GratitudeEngine {
    override fun getAllForOwner(owner: Id): List<Gratitude> {
        return transaction { Gratitudes.select { Gratitudes.owner eq owner.toUUID() }.map(rowToModel) }
    }

    override fun get(id: Id): Gratitude {
        return transaction {
            Gratitudes.select { Gratitudes.id eq id.toUUID() }.map(rowToModel).firstOrNull()
                    ?: throw NotFound(id.value, Gratitude::class)
        }
    }

    override fun get(ids: List<Id>): List<Gratitude> {
        val uuids = ids.map(Id::toUUID)
        return transaction { Gratitudes.select { Gratitudes.id inList uuids }.map(rowToModel) }
    }

    override fun create(model: Gratitude): Gratitude {
        val id = transaction { Gratitudes.insertAndGetId(fillColumns(model)) }
        return model.copy(id = id.value.toId())
    }

    override fun update(id: Id, model: Gratitude): Gratitude {
        val update = model.copy(id = id)
        transaction { Gratitudes.update({ Gratitudes.id eq id.toUUID() }, body = fillColumns(update)) }
        return update
    }

    override fun delete(id: Id): Boolean {
        return transaction { Gratitudes.deleteWhere { Gratitudes.id eq id.toUUID() } > 0 }
    }
}

fun fillColumns(gratitude: Gratitude): Gratitudes.(UpdateBuilder<Int>) -> Unit = {
    it[owner] = gratitude.owner.toUUID()
    it[title] = gratitude.title
    it[date] = gratitude.date
    it[description] = gratitude.description
    it[image_id] = gratitude.image
}

val rowToModel: (ResultRow) -> Gratitude = {
    Gratitude(id = it[Gratitudes.id].value.toId(),
            owner = it[Gratitudes.owner].toId(),
            title = it[Gratitudes.title],
            date = it[Gratitudes.date],
            description = it[Gratitudes.description],
            image = it[Gratitudes.image_id])
}
