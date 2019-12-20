package de.manuelhuber.purpose.features.users.models

import de.manuelhuber.purpose.lib.engine.Engine

interface UserEngine : Engine<User> {
    fun getByUsername(email: String): User
}
