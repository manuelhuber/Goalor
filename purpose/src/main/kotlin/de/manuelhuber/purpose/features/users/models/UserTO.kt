package de.manuelhuber.purpose.features.users.models

import de.manuelhuber.purpose.lib.engine.Id

data class UserTO(val email: Email, val id: Id, val username: Username, val firstName: String, val lastName: String) {
    companion object {
        fun fromUser(user: User): UserTO {
            return UserTO(user.email, user.id, user.username, user.firstName, user.lastName)
        }
    }
}
