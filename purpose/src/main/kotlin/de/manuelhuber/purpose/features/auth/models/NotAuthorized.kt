package de.manuelhuber.purpose.features.auth.models

class NotAuthorized(override val message: String = "Not allowed") : Exception()
