package de.manuelhuber.purpose.features.aspects.engine

import de.manuelhuber.purpose.features.aspects.model.Aspect
import de.manuelhuber.purpose.lib.engine.Id
import de.manuelhuber.purpose.lib.exceptions.NotFound

class AspectsEngineLocal : AspectsEngine {
    private val aspects = hashMapOf(
            Id("0") to Aspect(id = Id("0"),
                    name = "Health",
                    color = "blue",
                    completed = 50,
                    owner = Id("0"),
                    weight = 2),
            Id("1") to Aspect(id = Id("1"),
                    name = "Career",
                    color = "red",
                    completed = 75,
                    owner = Id("0"),
                    weight = 3),
            Id("2") to Aspect(id = Id("2"),
                    name = "Charity",
                    color = "green",
                    completed = 0,
                    owner = Id("0"),
                    weight = 1),
            Id("3") to Aspect(id = Id("3"),
                    name = "Social",
                    color = "pink",
                    completed = 0,
                    owner = Id("0"),
                    weight = 3))

    var id = 10

    override fun getAllForOwner(owner: Id): List<Aspect> {
        return aspects.values.filter { it.owner == owner }
    }

    override fun get(id: Id): Aspect {
        return aspects[id] ?: throw NotFound(id.value, Aspect::class)
    }

    override fun get(ids: List<Id>): List<Aspect> {
        return ids.map(::get)
    }

    override fun delete(id: Id): Boolean {
        val removed = aspects.remove(id)
        return removed == null
    }

    override fun create(model: Aspect): Aspect {
        val m = model.copy(id = Id(id++.toString()))
        aspects[m.id] = m
        return m
    }

    override fun update(id: Id, model: Aspect): Aspect {
        if (!aspects.containsKey(id)) {
            throw NotFound(id.value, Aspect::class)
        }
        aspects[id] = model
        return model
    }

}
