package de.manuelhuber.purpose.features.users.models

data class RegistrationResponse(val user: UserTO, val token: String)
