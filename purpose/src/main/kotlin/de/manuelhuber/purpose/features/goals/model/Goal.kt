package de.manuelhuber.purpose.features.goals.model

import de.manuelhuber.purpose.lib.engine.Id
import de.manuelhuber.purpose.lib.engine.Model
import de.manuelhuber.purpose.lib.engine.toId

data class Goal(override val id: Id,
                val owner: Id,
                val title: String,
                val aspect: Id? = null,
                val parent: Id? = null,
                val children: List<Id> = listOf(),
                val done: Boolean = false,
                val image: String? = null,
                val description: String? = null) : Model {
    companion object {
        fun fromData(data: GoalData, owner: String): Goal {
            return Goal(Id(""),
                    Id(owner),
                    data.title,
                    data.aspect?.toId(),
                    data.parent?.toId(),
                    data.children.map(String::toId),
                    data.done,
                    data.image,
                    data.description)
        }
    }
}
