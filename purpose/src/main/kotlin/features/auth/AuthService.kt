package features.auth

import com.auth0.jwt.JWT
import com.auth0.jwt.JWTCreator
import com.auth0.jwt.algorithms.Algorithm
import com.google.inject.Inject
import com.google.inject.name.Named
import features.auth.models.WrongPassword
import features.users.models.User
import features.users.models.UserEngine
import javalinjwt.JWTGenerator
import javalinjwt.JWTProvider
import org.mindrot.jbcrypt.BCrypt

class AuthService @Inject constructor(private val engine: UserEngine, @Named(JWT_SECRET) secret: String) {

    internal var provider: JWTProvider
        private set

    init {
        val algorithm = Algorithm.HMAC256(secret)
        val generator: JWTGenerator<User> = JWTGenerator { user: User, alg: Algorithm? ->
            val token: JWTCreator.Builder = JWT.create().withClaim(Claims.ID.name, user.id)
                .withClaim(Claims.USER_LEVEL.name, Roles.USER.name)
            token.sign(alg)
        }
        val verifier = JWT.require(algorithm).build()
        provider = JWTProvider(algorithm, generator, verifier)
    }

    fun login(mail: String, password: String): String {
        val user = engine.getByUsername(mail)
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
