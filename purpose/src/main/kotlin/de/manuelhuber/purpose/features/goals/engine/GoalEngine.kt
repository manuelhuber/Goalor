package de.manuelhuber.purpose.features.goals.engine

import de.manuelhuber.purpose.features.goals.model.Goal
import de.manuelhuber.purpose.lib.engine.Engine

interface GoalsEngine : Engine<Goal> {
    fun getAllForOwner(owner: String): List<Goal>
}
