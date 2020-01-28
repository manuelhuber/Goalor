package de.manuelhuber.purpose.features.users.models

import de.manuelhuber.purpose.lib.engine.Id
import de.manuelhuber.purpose.lib.engine.Model
import java.time.LocalDateTime

data class User(override val id: Id,
                val username: Username,
                val email: Email,
                val firstName: String,
                val lastName: String,
                val password: String,
                val logout: LocalDateTime? = null,
                val resetToken: String? = null) : Model {
    fun update(x: UserTO): User {
        return this.copy(email = x.email, username = x.username, firstName = x.firstName, lastName = x.lastName)
    }
}

inline class Username(val value: String)
inline class Email(val value: String)
