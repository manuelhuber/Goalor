package features.users

import com.auth0.jwt.JWT
import com.auth0.jwt.JWTCreator
import com.auth0.jwt.algorithms.Algorithm
import features.users.models.Login
import features.users.models.Registration
import features.users.models.User
import features.users.models.UserEngine
import javalinjwt.JWTGenerator
import javalinjwt.JWTProvider
import lib.auth.EMAIL
import lib.auth.Roles
import lib.auth.USER_LEVEL
import lib.auth.WrongPassword


class UserService(private val engine: UserEngine) {

    var provider: JWTProvider
        private set

    init {
        val algorithm = Algorithm.HMAC256("very_secret")
        val generator: JWTGenerator<User> = JWTGenerator<User> { user: User, alg: Algorithm? ->
            val token: JWTCreator.Builder = JWT.create()
                .withClaim(EMAIL, user.email)
                .withClaim(USER_LEVEL, Roles.USER.name)
            token.sign(alg)
        }
        val verifier = JWT.require(algorithm)
            .build()
        provider = JWTProvider(algorithm, generator, verifier)
    }

    fun getUser(email: String): User {
        return engine.get(email)
    }

    fun register(request: Registration): User {
        val user = User(request.email, hashPassword(request.password), "")
        engine.create(user)
        return user
    }

    fun login(reqLogin: Login): String {
        val user = engine.get(reqLogin.email)
        if (user.password == hashPassword(reqLogin.password)) {
            return generateToken(user)
        } else {
            throw WrongPassword()
        }
    }

    private fun hashPassword(password: String): String {
        return password
    }

    private fun generateToken(user: User): String {
        return provider.generateToken(user)
    }
}
