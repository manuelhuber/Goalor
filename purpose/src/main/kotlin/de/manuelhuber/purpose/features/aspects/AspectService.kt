package de.manuelhuber.purpose.features.aspects

import com.google.inject.Inject
import de.manuelhuber.purpose.features.aspects.engine.AspectsEngine
import de.manuelhuber.purpose.features.aspects.model.Aspect
import de.manuelhuber.purpose.features.aspects.model.CreateAspect
import de.manuelhuber.purpose.features.auth.checkOwnership
import de.manuelhuber.purpose.lib.engine.Id
import de.manuelhuber.purpose.lib.exceptions.NotFound

class AspectService @Inject constructor(val engine: AspectsEngine) {

    fun createNewAspect(create: CreateAspect, owner: Id): Aspect {
        return engine.create(Aspect(Id(""),
                create.name,
                create.weight,
                create.color,
                create.completed,
                owner))
    }

    fun getAspects(id: Id): Aspect {
        return engine.get(id)
    }

    fun getAspectsByOwner(ownerId: Id): List<Aspect> {
        return engine.getAllForOwner(ownerId)
    }

    fun deleteAspect(id: Id, updaterId: Id) {
        checkOwnership(engine.get(id), updaterId)
        if (!engine.delete(id)) throw NotFound(id.value, Aspect::class)
    }

    fun updateAspect(id: Id, update: CreateAspect, updaterId: Id): Aspect {
        val aspect = engine.get(id)
        checkOwnership(engine.get(id), updaterId)
        return engine.update(id, aspect.update(update))
    }

}
