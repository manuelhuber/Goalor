package de.manuelhuber.purpose.features.users

import com.google.inject.Inject
import de.manuelhuber.purpose.features.auth.AuthService
import de.manuelhuber.purpose.features.auth.models.NotAuthorized
import de.manuelhuber.purpose.features.users.engine.UserEngine
import de.manuelhuber.purpose.features.users.models.Registration
import de.manuelhuber.purpose.features.users.models.User
import de.manuelhuber.purpose.features.users.models.UserTO
import de.manuelhuber.purpose.features.users.models.Username
import de.manuelhuber.purpose.lib.engine.Id
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
        return engine.create(User(id = Id(""),
                                  username = request.username,
                                  email = request.email,
                                  firstName = request.firstName,
                                  lastName = request.lastName,
                                  password = authService.hashPassword(request.password)))
    }

    fun updatePassword(userId: Id, newPW: String, oldPw: String? = null, token: String? = null): String {
        val user = engine.get(userId)
        when {
            oldPw != null -> authService.login(user.username, oldPw)
            token != null -> user.resetToken.equals(token)
            else -> throw NotAuthorized("Either previous password or reset token needed to set new password")
        }
        return updatePassword(userId, newPW)
    }

    fun updatePassword(userId: Id, newPW: String): String {
        val user = getUserById(userId)
        val update = user.copy(password = authService.hashPassword(newPW), logout = LocalDateTime.now())
        engine.update(userId, update)
        val token = authService.login(user.username, newPW)
        return token
    }

}
