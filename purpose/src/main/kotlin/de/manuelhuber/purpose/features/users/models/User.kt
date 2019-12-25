package de.manuelhuber.purpose.features.users.models

import de.manuelhuber.purpose.lib.engine.Id
import de.manuelhuber.purpose.lib.engine.Model

data class User(val email: Email,
                val username: Username,
                val firstName: String,
                val lastName: String,
                val password: String,
                override val id: Id) : Model

inline class Username(val value: String)
inline class Email(val value: String)
