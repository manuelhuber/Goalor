package de.manuelhuber.purpose.features.gratitude.engine

import de.manuelhuber.purpose.features.gratitude.model.Gratitude
import de.manuelhuber.purpose.features.users.engine.Users
import de.manuelhuber.purpose.lib.engine.Id
import de.manuelhuber.purpose.lib.engine.toId
import de.manuelhuber.purpose.lib.engine.toUUID
import org.jetbrains.exposed.dao.id.UUIDTable
import org.jetbrains.exposed.sql.ReferenceOption
import org.jetbrains.exposed.sql.`java-time`.date
import org.jetbrains.exposed.sql.insertAndGetId
import org.jetbrains.exposed.sql.select
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
        return transaction {
            Gratitudes.select { Gratitudes.owner eq owner.toUUID() }.map {
                Gratitude(id = it[Gratitudes.id].value.toId(),
                        owner = it[Gratitudes.owner].toId(),
                        title = it[Gratitudes.title],
                        date = it[Gratitudes.date],
                        description = it[Gratitudes.description],
                        image = it[Gratitudes.image_id]
                )
            }
        }
    }

    override fun get(id: Id): Gratitude {
        TODO()
    }

    override fun get(ids: List<Id>): List<Gratitude> {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun create(model: Gratitude): Gratitude {
        val id = transaction {
            Gratitudes.insertAndGetId {
                it[owner] = model.owner.toUUID()
                it[title] = model.title
                it[date] = model.date
                it[description] = model.description
                it[image_id] = model.image
            }
        }
        return model.copy(id = id.value.toId())
    }

    override fun update(id: Id, model: Gratitude): Gratitude {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }

    override fun delete(id: Id): Boolean {
        TODO("not implemented") //To change body of created functions use File | Settings | File Templates.
    }
}
