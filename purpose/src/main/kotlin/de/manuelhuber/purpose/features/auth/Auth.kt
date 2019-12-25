package de.manuelhuber.purpose.features.auth

import com.auth0.jwt.interfaces.DecodedJWT
import de.manuelhuber.purpose.features.users.UserService
import de.manuelhuber.purpose.lib.engine.Id
import io.javalin.Javalin
import javalinjwt.JWTProvider
import javalinjwt.JavalinJWT


enum class Claims {
    USER_LEVEL, ID, USER
}

const val JWT_SECRET = "jwt_secret"

fun addAuth(app: Javalin, jwtProvider: JWTProvider, userService: UserService) {
    // decrypt JWT
    app.before(JavalinJWT.createHeaderDecodeHandler(jwtProvider))

    // Read email from JWT and add it to ctx for easier access in controller
    app.before { ctx ->
        if (JavalinJWT.containsJWT(ctx)) {
            val jwt = ctx.attribute<DecodedJWT>("jwt")
            val userId = jwt!!.getClaim(Claims.ID.name)
            if (!userId.isNull) {
                ctx.attribute(Claims.ID.name, userId.asString())
                ctx.attribute(Claims.USER.name, userService.getUserById(Id(userId.asString())))
            }
        }
    }
}

