package features.users.models

import lib.engine.Engine

interface UserEngine : Engine<User> {
    fun getByUsername(email: String): User
}
