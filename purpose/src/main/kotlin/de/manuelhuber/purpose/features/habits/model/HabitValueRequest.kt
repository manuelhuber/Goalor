package de.manuelhuber.purpose.features.habits.model

import java.time.LocalDate

data class HabitValueRequest(val date: LocalDate, val value: Int)
