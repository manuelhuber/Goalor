package de.manuelhuber.purpose.features.auth

import com.auth0.jwt.JWT
import com.auth0.jwt.JWTCreator
import com.auth0.jwt.algorithms.Algorithm
import com.google.inject.Inject
import com.google.inject.name.Named
import de.manuelhuber.annotations.Roles
import de.manuelhuber.purpose.features.auth.models.WrongPassword
import de.manuelhuber.purpose.features.users.engine.UserEngine
import de.manuelhuber.purpose.features.users.models.User
import de.manuelhuber.purpose.features.users.models.Username
import de.manuelhuber.purpose.lib.engine.Id
import javalinjwt.JWTGenerator
import javalinjwt.JWTProvider
import org.mindrot.jbcrypt.BCrypt
import java.time.LocalDateTime
import java.time.ZoneOffset
import java.util.*

class AuthService @Inject constructor(private val engine: UserEngine, @Named(JWT_SECRET) secret: String) {

    internal var provider: JWTProvider
        private set

    init {
        val algorithm = Algorithm.HMAC256(secret)
        val generator: JWTGenerator<User> = JWTGenerator { user: User, alg: Algorithm? ->
            val token: JWTCreator.Builder =
                    JWT.create()
                        .withClaim(Claims.ID.name, user.id.value)
                        .withClaim(Claims.USER_LEVEL.name, Roles.USER.name)
                        .withClaim(Claims.CREATED.name, LocalDateTime.now().toString())
            token.sign(alg)
        }
        val verifier =
                JWT.require(algorithm)
                    .build()
        provider = JWTProvider(algorithm, generator, verifier)
    }

    fun logout(userId: Id) {
        val user = engine.get(userId)
        engine.update(userId, user.copy(logout = LocalDateTime.now()))
    }

    fun login(username: Username, password: String): String {
        val user = engine.getByUsername(username)
        if (validate(password, user.password)) {
            return generateToken(user)
        } else {
            throw WrongPassword()
        }
    }

    fun hashPassword(password: String): String {
        return BCrypt.hashpw(password, BCrypt.gensalt())
    }

    private fun validate(candidate: String, hashed: String): Boolean {
        return BCrypt.checkpw(candidate, hashed)
    }

    private fun generateToken(user: User): String {
        return provider.generateToken(user)
    }
}
