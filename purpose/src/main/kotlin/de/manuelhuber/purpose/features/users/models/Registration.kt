package de.manuelhuber.purpose.features.users.models

import de.manuelhuber.annotations.NotEmpty
import de.manuelhuber.annotations.ValueNotEmpty

data class Registration(@ValueNotEmpty
                        val email: Email,
                        @ValueNotEmpty
                        val username: Username,
                        val firstName: String,
                        val lastName: String,
                        @NotEmpty
                        val password: String)
