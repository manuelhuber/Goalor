package de.manuelhuber.purpose.features.habits.model

import de.manuelhuber.purpose.lib.engine.Id
import de.manuelhuber.purpose.lib.engine.OwnedModel

data class Habit(override val id: Id,
                 override val owner: Id,
                 val title: String,
                 val options: Int) : OwnedModel
