package de.manuelhuber.purpose.features.habits.model

import de.manuelhuber.purpose.lib.engine.Id
import de.manuelhuber.purpose.lib.engine.Model
import java.time.LocalDate

data class HabitValue(override val id: Id, val habit: Id, val value: Int, val date: LocalDate) : Model
