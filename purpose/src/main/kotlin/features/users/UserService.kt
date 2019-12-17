package features.users

import com.google.inject.Inject
import features.auth.AuthService
import features.users.models.AccountAlreadyExists
import features.users.models.Registration
import features.users.models.User
import features.users.models.UserEngine
import lib.engine.NotFound


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
