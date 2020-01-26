package de.manuelhuber.purpose.features.users.models

import de.manuelhuber.purpose.lib.engine.Id
import de.manuelhuber.purpose.lib.engine.Model
import java.time.LocalDateTime

data class User(val email: Email,
                val username: Username,
                val firstName: String,
                val lastName: String,
                val password: String,
                val logout: LocalDateTime?,
                override val id: Id) : Model {
    fun update(x: UserTO): User {
        return this.copy(email = x.email, username = x.username, firstName = x.firstName, lastName = x.lastName)
    }
}

inline class Username(val value: String)
inline class Email(val value: String)
