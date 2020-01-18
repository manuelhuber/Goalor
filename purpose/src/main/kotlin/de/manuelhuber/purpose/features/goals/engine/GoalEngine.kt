package de.manuelhuber.purpose.features.goals.engine

import de.manuelhuber.purpose.features.goals.model.Goal
import de.manuelhuber.purpose.lib.engine.Engine
import de.manuelhuber.purpose.lib.engine.Id

interface GoalsEngine : Engine<Goal> {
    fun getAllForOwner(owner: Id): List<Goal>
}
