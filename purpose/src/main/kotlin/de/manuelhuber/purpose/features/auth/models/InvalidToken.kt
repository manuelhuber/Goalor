package de.manuelhuber.purpose.features.auth.models

class InvalidToken(override val message: String = "Invalid token") : Exception()
