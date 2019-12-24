package de.manuelhuber.purpose.features.aspects.model

import de.manuelhuber.purpose.features.aspects.Goal
import de.manuelhuber.purpose.lib.engine.Engine

interface GoalsEngine : Engine<Goal> {
    fun getAllForOwner(owner: String): List<Goal>
}
