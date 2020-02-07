package de.manuelhuber.purpose.features.habits.engine

import de.manuelhuber.purpose.features.habits.model.HabitValue
import de.manuelhuber.purpose.lib.engine.Id
import de.manuelhuber.purpose.lib.engine.toId
import de.manuelhuber.purpose.lib.engine.toUUID
import de.manuelhuber.purpose.lib.exceptions.NotFound
import org.jetbrains.exposed.dao.id.UUIDTable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.`java-time`.date
import org.jetbrains.exposed.sql.statements.UpdateBuilder
import org.jetbrains.exposed.sql.transactions.transaction
import java.time.LocalDate

object HabitValues : UUIDTable() {
    val habit = uuid("habit_id").references(Habits.id, onDelete = ReferenceOption.CASCADE).index()
    val date = date("date")
    val value = integer("value")
}

class HabitValuePostgresEngine : HabitValueEngine {

    override fun getAllForHabit(habit: Id, from: LocalDate, to: LocalDate): List<HabitValue> {
        return transaction {
            HabitValues.select {
                (HabitValues.habit eq habit.toUUID()) and
                        (HabitValues.date greaterEq from) and
                        (HabitValues.date lessEq to)
            }.map(rowToHabitValue)
        }
    }

    override fun getAllForHabits(habits: List<Id>, from: LocalDate, to: LocalDate): Map<LocalDate, List<HabitValue>> {
        val uuids = habits.map(Id::toUUID)
        return transaction {
            HabitValues.select {
                (HabitValues.habit inList uuids) and
                        (HabitValues.date greaterEq from) and
                        (HabitValues.date lessEq to)
            }.orderBy(HabitValues.date).map(rowToHabitValue)

        }.groupBy { habitValue: HabitValue -> habitValue.date }
    }

    override fun deleteAllValuesWExcept(habit: Id, valuesToKeep: List<Int>) {
        transaction {
            HabitValues.deleteWhere { HabitValues.value notInList valuesToKeep }
        }
    }

    override fun get(id: Id): HabitValue {
        return transaction {
            HabitValues.select { HabitValues.id eq id.toUUID() }.map(rowToHabitValue).firstOrNull()
                    ?: throw NotFound(id.value, HabitValue::class)
        }
    }

    override fun get(ids: List<Id>): List<HabitValue> {
        val uuids = ids.map(Id::toUUID)
        return transaction { HabitValues.select { HabitValues.id inList uuids }.map(rowToHabitValue) }
    }

    override fun create(model: HabitValue): HabitValue {
        val id = transaction { HabitValues.insertAndGetId(fillColumns(model)) }
        return model.copy(id = id.value.toId())
    }

    override fun update(id: Id, model: HabitValue): HabitValue {
        val update = model.copy(id = id)
        transaction { HabitValues.update({ HabitValues.id eq id.toUUID() }, body = fillColumns(update)) }
        return update
    }

    override fun delete(id: Id): Boolean {
        return transaction { HabitValues.deleteWhere { HabitValues.id eq id.toUUID() } > 0 }
    }
}

fun fillColumns(habit: HabitValue): HabitValues.(UpdateBuilder<Int>) -> Unit = {
    it[HabitValues.habit] = habit.habit.toUUID()
    it[value] = habit.value
    it[date] = habit.date
}

val rowToHabitValue: (ResultRow) -> HabitValue = {
    HabitValue(id = it[HabitValues.id].value.toId(),
            habit = it[HabitValues.habit].toId(),
            value = it[HabitValues.value],
            date = it[HabitValues.date])
}
