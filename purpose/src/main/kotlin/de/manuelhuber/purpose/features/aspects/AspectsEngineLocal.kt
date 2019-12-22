package de.manuelhuber.purpose.features.aspects

import de.manuelhuber.purpose.features.aspects.model.AspectsEngine

class AspectsEngineLocal : AspectsEngine {
    private val aspects = hashMapOf(
            "0" to Aspect(id = "0", name = "Health", color = "blue", completed = 50, owner = "0", weight = 2),
            "1" to Aspect(id = "1", name = "Career", color = "red", completed = 75, owner = "0", weight = 3),
            "2" to Aspect(id = "2", name = "Charity", color = "green", completed = 0, owner = "0", weight = 1),
            "3" to Aspect(id = "3", name = "Social", color = "pink", completed = 0, owner = "0", weight = 3))

    var id = 10

    override fun getAllForOwner(owner: String): List<Aspect> {
        return aspects.values.filter { aspect -> aspect.owner == owner }
    }

    override fun get(id: String): Aspect {
        return aspects[id] ?: throw Exception()
    }

    override fun delete(id: String): Boolean {
        val removed = aspects.remove(id)
        return removed == null
    }

    override fun create(model: Aspect): Aspect {
        val m = model.copy(id = id++.toString())
        aspects[m.id] = m
        return m
    }

    override fun update(id: String, model: Aspect): Aspect {
        aspects[id] = model
        return model
    }

}
