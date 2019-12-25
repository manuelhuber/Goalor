package de.manuelhuber.purpose.features.users

import com.google.inject.Inject
import de.manuelhuber.purpose.features.auth.AuthService
import de.manuelhuber.purpose.features.users.models.*
import de.manuelhuber.purpose.lib.engine.Id
import de.manuelhuber.purpose.lib.exceptions.NotFound


class UserService @Inject constructor(private val authService: AuthService, private val engine: UserEngine) {

    fun getUserByUsername(username: Username): User {
        return engine.getByUsername(username)
    }

    fun getUserById(id: Id): User {
        return engine.get(id)
    }

    fun register(request: Registration): User {
        try {
            engine.getByUsername(request.username)
            throw AccountAlreadyExists()
        } catch (e: NotFound) {
            return engine.create(User(email = request.email,
                    password = authService.hashPassword(request.password),
                    firstName = request.firstName,
                    lastName = request.lastName,
                    username = request.username,
                    id = Id("")))
        }
    }

}
