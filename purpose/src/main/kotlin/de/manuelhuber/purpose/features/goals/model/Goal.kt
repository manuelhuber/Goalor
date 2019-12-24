package de.manuelhuber.purpose.features.aspects

import de.manuelhuber.purpose.lib.engine.Model

data class Goal(override val id: String,
                val owner: String,
                val title: String,
                val aspect: String? = null,
                val parent: String? = null,
                val children: List<String> = listOf(),
                val done: Boolean = false,
                val image: String? = null,
                val description: String? = null) : Model {
    companion object {
        fun fromData(data: GoalData, owner: String): Goal {
            return Goal("",
                    owner,
                    data.title,
                    data.aspect,
                    data.parent,
                    data.children,
                    data.done,
                    data.image,
                    data.description)
        }
    }
}
