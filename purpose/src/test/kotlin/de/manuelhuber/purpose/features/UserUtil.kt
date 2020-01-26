package de.manuelhuber.purpose.features

import de.manuelhuber.purpose.features.users.models.Email
import de.manuelhuber.purpose.features.users.models.User
import de.manuelhuber.purpose.features.users.models.Username
import de.manuelhuber.purpose.lib.engine.Id

fun testUser(password: String = "password"): User {
    return User(Email("mail"), Username("username"), "First", "Last", password, id = Id("0"), logout = null)
}
