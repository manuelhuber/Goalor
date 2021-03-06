package de.manuelhuber.purpose.features.aspects.model

import de.manuelhuber.purpose.lib.engine.Id
import de.manuelhuber.purpose.lib.engine.OwnedModel

data class Aspect(override val id: Id,
                  val name: String,
                  val weight: Int,
                  val color: String,
                  val completed: Int,
                  override val owner: Id) : OwnedModel {
    fun update(update: CreateAspect): Aspect {
        return this.copy(name = update.name, weight = update.weight, color = update.color, completed = update.completed)
    }
}
