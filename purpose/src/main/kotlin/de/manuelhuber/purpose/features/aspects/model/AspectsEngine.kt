package de.manuelhuber.purpose.features.aspects.model

import de.manuelhuber.purpose.features.aspects.Aspect
import de.manuelhuber.purpose.lib.engine.Engine

interface AspectsEngine : Engine<Aspect> {
    fun getAllForOwner(owner: String): List<Aspect>
}
