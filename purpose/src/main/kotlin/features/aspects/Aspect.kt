package features.aspects

import lib.engine.Model

data class Aspect(override val id: String, val name: String, val weight: Int, val color: String, val completed: Int) :
        Model
