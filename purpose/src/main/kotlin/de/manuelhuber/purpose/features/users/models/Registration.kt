package de.manuelhuber.purpose.features.users.models

data class Registration(val email: Email,
                        val username: Username,
                        val firstName: String,
                        val lastName: String,
                        val password: String)
