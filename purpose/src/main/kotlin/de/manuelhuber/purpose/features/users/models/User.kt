package de.manuelhuber.purpose.features.users.models

import de.manuelhuber.purpose.lib.engine.Model

data class User(val email: String,
                val username: String,
                val firstName: String,
                val lastName: String,
                val password: String,
                override val id: String) : Model
