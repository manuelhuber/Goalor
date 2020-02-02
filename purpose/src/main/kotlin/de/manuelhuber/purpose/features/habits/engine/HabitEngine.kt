package de.manuelhuber.purpose.features.habits.engine

import de.manuelhuber.purpose.features.habits.model.Habit
import de.manuelhuber.purpose.lib.engine.Engine
import de.manuelhuber.purpose.lib.engine.Id

interface HabitEngine : Engine<Habit> {
    fun getAllForOwner(owner: Id): List<Habit>
}
