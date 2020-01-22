package de.manuelhuber.purpose.features.auth

import de.manuelhuber.purpose.features.auth.models.Forbidden
import de.manuelhuber.purpose.lib.engine.Id
import de.manuelhuber.purpose.lib.engine.OwnedModel

fun checkOwnership(model: OwnedModel, owner: Id) {
    if (model.owner != owner) {
        throw Forbidden("You're not the owner of the ${model.javaClass.simpleName} id=${model.id}")
    }
}
