package de.manuelhuber.purpose.features.auth.models

import de.manuelhuber.purpose.features.users.models.Username

data class Login(val username: Username, val password: String)
