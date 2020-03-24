package de.manuelhuber.purpose.features.users.models

import de.manuelhuber.annotations.MinLength
import de.manuelhuber.annotations.ValueNotEmpty

data class Registration(@ValueNotEmpty
                        val email: Email,
                        @ValueNotEmpty
                        val username: Username,
                        val firstName: String,
                        val lastName: String,
                        @MinLength(5)
                        val password: String)
