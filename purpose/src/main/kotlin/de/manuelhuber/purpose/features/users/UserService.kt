package de.manuelhuber.purpose.features.users

import com.google.inject.Inject
import de.manuelhuber.purpose.features.auth.AuthService
import de.manuelhuber.purpose.features.users.engine.UserEngine
import de.manuelhuber.purpose.features.users.models.*
import de.manuelhuber.purpose.lib.engine.Id
import de.manuelhuber.purpose.lib.exceptions.NotFound
import java.time.LocalDateTime


class UserService @Inject constructor(private val authService: AuthService, private val engine: UserEngine) {

    fun getUserByUsername(username: Username): User {
        return engine.getByUsername(username)
    }

    fun getUserById(id: Id): User {
        return engine.get(id)
    }

    fun updateUser(id: Id, userTO: UserTO): User {
        val prev = engine.get(id)
        return engine.update(id, prev.update(userTO))
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
                                      id = Id(""),
                                      logout = null))
        }
    }

    fun updatePassword(userId: Id, newPW: String, old: String): String {
        val user = getUserById(userId)
        val token = authService.login(user.username, old)
        val update = user.copy(password = authService.hashPassword(newPW), logout = LocalDateTime.now())
        engine.update(userId, update)
        return token
    }

}
