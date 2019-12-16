package features.users.models

import lib.engine.Model

data class User(val email: String,
                val username: String,
                val firstName: String,
                val lastName: String,
                val password: String,
                override val id: String) : Model
