package de.manuelhuber.purpose.features.users.models

import de.manuelhuber.purpose.lib.engine.Id

data class UserTO(val email: Email, val id: Id) {
    companion object {
        fun fromUser(user: User): UserTO {
            return UserTO(user.email, user.id)
        }
    }
}
