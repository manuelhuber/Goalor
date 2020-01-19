package de.manuelhuber.purpose.features.gratitude.engine

import de.manuelhuber.purpose.features.gratitude.model.Gratitude
import de.manuelhuber.purpose.lib.engine.Engine
import de.manuelhuber.purpose.lib.engine.Id

interface GratitudeEngine : Engine<Gratitude> {
    fun getAllForOwner(owner: Id): List<Gratitude>
}
