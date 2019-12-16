package features.auth

import com.auth0.jwt.interfaces.DecodedJWT
import io.javalin.Javalin
import io.javalin.core.security.Role
import javalinjwt.JWTProvider
import javalinjwt.JavalinJWT


internal enum class Roles : Role {
    ANYONE, USER,
}

enum class Claims {
    USER_LEVEL, ID,

}

const val JWT_SECRET = "jwt_secret"

fun addAuth(app: Javalin, jwtProvider: JWTProvider) {
    // decrypt JWT
    app.before(JavalinJWT.createHeaderDecodeHandler(jwtProvider))

    // Read email from JWT and add it to ctx for easier access in controller
    app.before { ctx ->
        if (JavalinJWT.containsJWT(ctx)) {
            val jwt = ctx.attribute<DecodedJWT>("jwt")
            val userId = jwt!!.getClaim(Claims.ID.name)
            if (!userId.isNull) {
                ctx.attribute(Claims.ID.name, userId.asString())
            }
        }
    }
}

