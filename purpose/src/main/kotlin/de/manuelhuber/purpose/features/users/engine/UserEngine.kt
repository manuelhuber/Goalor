package de.manuelhuber.purpose.features.users.engine

import de.manuelhuber.purpose.features.users.models.User
import de.manuelhuber.purpose.features.users.models.Username
import de.manuelhuber.purpose.lib.engine.Engine

interface UserEngine : Engine<User> {
    fun getByUsername(username: Username): User
}
