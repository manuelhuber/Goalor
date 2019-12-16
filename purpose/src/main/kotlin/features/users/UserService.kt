package features.users

import com.auth0.jwt.JWT
import com.auth0.jwt.JWTCreator
import com.auth0.jwt.algorithms.Algorithm
import com.google.inject.Inject
import features.users.models.Registration
import features.users.models.User
import features.users.models.UserEngine
import javalinjwt.JWTGenerator
import javalinjwt.JWTProvider
import lib.auth.*
import lib.engine.NotFound
import org.mindrot.jbcrypt.BCrypt


class UserService @Inject constructor(private val engine: UserEngine) {

    var provider: JWTProvider
        private set

    init {
        val algorithm = Algorithm.HMAC256("very_secret")
        val generator: JWTGenerator<User> = JWTGenerator { user: User, alg: Algorithm? ->
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
        return engine.getByEmail(email)
    }

    fun register(request: Registration): User {
        try {
            engine.getByEmail(request.email)
            throw AccountAlreadyExists()
        } catch (e: NotFound) {
            return engine.create(User(request.email, hashPassword(request.password), ""))
        }
    }

    fun login(mail: String, password: String): String {
        val user = engine.getByEmail(mail)
        if (validate(password, user.password)) {
            return generateToken(user)
        } else {
            throw WrongPassword()
        }
    }

    private fun validate(candidate: String, hashed: String): Boolean {
        return BCrypt.checkpw(candidate, hashed)
    }

    private fun hashPassword(password: String): String {
        return BCrypt.hashpw(password, BCrypt.gensalt())
    }

    private fun generateToken(user: User): String {
        return provider.generateToken(user)
    }
}
