package de.manuelhuber.purpose.features.habits.engine

import de.manuelhuber.purpose.features.habits.model.HabitValue
import de.manuelhuber.purpose.lib.engine.Engine
import de.manuelhuber.purpose.lib.engine.Id
import java.time.LocalDate

interface HabitValueEngine : Engine<HabitValue> {
    fun getAllForHabit(habit: Id, from: LocalDate, to: LocalDate): List<HabitValue>
    fun getAllForHabits(habits: List<Id>, from: LocalDate, to: LocalDate): Map<LocalDate, List<HabitValue>>
    fun deleteAllValuesWExcept(habit: Id, valuesToKeep: List<Int>)
}
