package de.manuelhuber.purpose.features.habits

import com.google.inject.Inject
import de.manuelhuber.purpose.features.auth.checkOwnership
import de.manuelhuber.purpose.features.habits.engine.HabitEngine
import de.manuelhuber.purpose.features.habits.engine.HabitValueEngine
import de.manuelhuber.purpose.features.habits.model.Habit
import de.manuelhuber.purpose.features.habits.model.HabitRequest
import de.manuelhuber.purpose.features.habits.model.HabitValue
import de.manuelhuber.purpose.features.habits.model.HabitValueRequest
import de.manuelhuber.purpose.lib.engine.Id
import de.manuelhuber.purpose.lib.engine.PlaceholderId
import de.manuelhuber.purpose.lib.exceptions.ValidationError
import java.time.LocalDate

class HabitService @Inject constructor(private val habitEngine: HabitEngine,
                                       private val habitValueEngine: HabitValueEngine) {

    private val validValues = mapOf(
            1 to listOf(1),
            2 to listOf(-1, 1),
            3 to listOf(-1, 0, 1),
            4 to listOf(-2, -1, 1, 2),
            5 to listOf(-2, -1, 0, 1, 2)
    )

    fun getHabits(owner: Id): List<Habit> {
        return habitEngine.getAllForOwner(owner)
    }

    fun getHabitValues(owner: Id, from: LocalDate, to: LocalDate): Map<LocalDate, List<HabitValue>> {
        val habits = habitEngine.getAllForOwner(owner).map(Habit::id)
        return habitValueEngine.getAllForHabits(habits, from, to)
    }

    fun createHabit(habitData: HabitRequest, owner: Id): Habit {
        validateOptions(habitData.options)
        return habitEngine.create(Habit(
                id = PlaceholderId,
                owner = owner,
                options = habitData.options,
                title = habitData.title))
    }

    fun addValue(habitId: Id,
                 request: HabitValueRequest,
                 requesterId: Id): HabitValue {
        val habit = habitEngine.get(habitId)
        checkOwnership(habit, requesterId)
        validateValue(habit.options, request.value)
        return habitValueEngine.create(HabitValue(
                id = PlaceholderId,
                value = request.value,
                date = request.date,
                habit = habitId
        ))
    }

    private fun validateOptions(options: Int) {
        if (options == -1 || validValues.containsKey(options)) {
            return
        }
        throw ValidationError("Options=$options not allowed")
    }

    private fun validateValue(options: Int, value: Int) {
        if (options == -1) {
            return
        }
        if (validValues.getOrDefault(options, emptyList()).contains(value)) {
            return
        }
        throw ValidationError("Value=$value not allowed for a habit with options=$options")

    }
}
