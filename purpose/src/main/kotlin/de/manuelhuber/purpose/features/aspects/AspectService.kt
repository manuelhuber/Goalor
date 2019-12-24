package de.manuelhuber.purpose.features.aspects

import com.google.inject.Inject
import de.manuelhuber.purpose.features.aspects.model.AspectsEngine
import de.manuelhuber.purpose.features.aspects.model.CreateAspect
import de.manuelhuber.purpose.features.auth.models.NotAuthorized

class AspectService @Inject constructor(val engine: AspectsEngine) {

    fun createNewAspect(create: CreateAspect, owner: String): Aspect {
        return engine.create(Aspect("", create.name, create.weight, create.color, create.completed, owner))
    }

    fun getAspects(id: String): Aspect {
        return engine.get(id)
    }

    fun getAspectsByOwner(ownerId: String): List<Aspect> {
        return engine.getAllForOwner(ownerId)
    }

    fun deleteAspect(id: String, updaterId: String): Boolean {
        checkAuthorization(engine.get(id), updaterId)
        return engine.delete(id)
    }

    fun updateAspect(id: String, update: CreateAspect, updaterId: String): Aspect {
        val aspect = engine.get(id)
        checkAuthorization(engine.get(id), updaterId)
        return engine.update(id, aspect.update(update))
    }

    private fun checkAuthorization(aspect: Aspect, updaterId: String) {
        if (aspect.owner != updaterId) {
            throw NotAuthorized("You're not the owner of the Aspect id=${aspect.id}")
        }
    }
}
