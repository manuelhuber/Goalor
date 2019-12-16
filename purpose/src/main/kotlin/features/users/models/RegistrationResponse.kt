package features.users.models

data class RegistrationResponse(val user: UserTO, val token: String)
