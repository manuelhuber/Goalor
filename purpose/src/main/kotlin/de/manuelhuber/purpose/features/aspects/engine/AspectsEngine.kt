package de.manuelhuber.purpose.features.aspects.engine

import de.manuelhuber.purpose.features.aspects.model.Aspect
import de.manuelhuber.purpose.lib.engine.Engine
import de.manuelhuber.purpose.lib.engine.Id

interface AspectsEngine : Engine<Aspect> {
    fun getAllForOwner(owner: Id): List<Aspect>
}
