package de.manuelhuber.purpose.features.habits.engine

import de.manuelhuber.purpose.features.habits.model.Habit
import de.manuelhuber.purpose.features.users.engine.Users
import de.manuelhuber.purpose.lib.engine.Id
import de.manuelhuber.purpose.lib.engine.toId
import de.manuelhuber.purpose.lib.engine.toUUID
import de.manuelhuber.purpose.lib.exceptions.NotFound
import org.jetbrains.exposed.dao.id.UUIDTable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.statements.UpdateBuilder
import org.jetbrains.exposed.sql.transactions.transaction

object Habits : UUIDTable() {
    val owner = uuid("owner_id").references(Users.id, onDelete = ReferenceOption.CASCADE).index()
    val title = varchar("title", 150)
    val options = integer("options")
}

class HabitPostgresEngine : HabitEngine {
    override fun getAllForOwner(owner: Id): List<Habit> {
        return transaction { Habits.select { Habits.owner eq owner.toUUID() }.map(rowToHabit) }
    }

    override fun get(id: Id): Habit {
        return transaction {
            Habits.select { Habits.id eq id.toUUID() }.map(rowToHabit).firstOrNull()
                    ?: throw NotFound(id.value, Habit::class)
        }
    }

    override fun get(ids: List<Id>): List<Habit> {
        val uuids = ids.map(Id::toUUID)
        return transaction { Habits.select { Habits.id inList uuids }.map(rowToHabit) }
    }

    override fun create(model: Habit): Habit {
        val id = transaction { Habits.insertAndGetId(fillColumns(model)) }
        return model.copy(id = id.value.toId())
    }

    override fun update(id: Id, model: Habit): Habit {
        val update = model.copy(id = id)
        transaction { Habits.update({ Habits.id eq id.toUUID() }, body = fillColumns(update)) }
        return update
    }

    override fun delete(id: Id): Boolean {
        return transaction { Habits.deleteWhere { Habits.id eq id.toUUID() } > 0 }
    }
}

fun fillColumns(habit: Habit): Habits.(UpdateBuilder<Int>) -> Unit = {
    it[owner] = habit.owner.toUUID()
    it[title] = habit.title
    it[options] = habit.options
}

val rowToHabit: (ResultRow) -> Habit = {
    Habit(id = it[Habits.id].value.toId(),
            owner = it[Habits.owner].toId(),
            title = it[Habits.title],
            options = it[Habits.options])
}
