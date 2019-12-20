package de.manuelhuber.purpose.features.users

import com.google.inject.Inject
import de.manuelhuber.purpose.features.auth.AuthService
import de.manuelhuber.purpose.features.users.models.AccountAlreadyExists
import de.manuelhuber.purpose.features.users.models.Registration
import de.manuelhuber.purpose.features.users.models.User
import de.manuelhuber.purpose.features.users.models.UserEngine
import de.manuelhuber.purpose.lib.engine.NotFound


class UserService @Inject constructor(private val authService: AuthService, private val engine: UserEngine) {

    fun getUserByUsername(username: String): User {
        return engine.getByUsername(username)
    }

    fun register(request: Registration): User {
        try {
            engine.getByUsername(request.email)
            throw AccountAlreadyExists()
        } catch (e: NotFound) {
            return engine.create(User(email = request.email,
                    password = authService.hashPassword(request.password),
                    firstName = request.firstName,
                    lastName = request.lastName,
                    username = request.username,
                    id = ""))
        }
    }

}
