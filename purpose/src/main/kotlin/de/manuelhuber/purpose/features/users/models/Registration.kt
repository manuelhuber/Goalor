package de.manuelhuber.purpose.features.users.models

data class Registration(val email: String,
                        val username: String,
                        val firstName: String,
                        val lastName: String,
                        val password: String)
