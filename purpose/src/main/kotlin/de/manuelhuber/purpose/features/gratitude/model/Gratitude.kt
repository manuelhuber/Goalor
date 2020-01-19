package de.manuelhuber.purpose.features.gratitude.model

import de.manuelhuber.purpose.lib.engine.Id
import de.manuelhuber.purpose.lib.engine.Model
import java.time.LocalDate
import java.util.*

data class Gratitude(override val id: Id,
                     val owner: Id,
                     val title: String,
                     val date: LocalDate,
                     val description: String?,
                     val image: String?) : Model
