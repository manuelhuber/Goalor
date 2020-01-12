package de.manuelhuber.purpose.features.goals.model

import de.manuelhuber.purpose.lib.engine.Engine

interface GoalsEngine : Engine<Goal> {
    fun getAllForOwner(owner: String): List<Goal>
}
