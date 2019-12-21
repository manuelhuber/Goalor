package de.manuelhuber.purpose.features.aspects

import de.manuelhuber.purpose.lib.engine.Model

data class Aspect(override val id: String,
                  val name: String,
                  val weight: Int,
                  val color: String,
                  val completed: Int,
                  val owner: String) : Model
