package lib.auth

import com.auth0.jwt.interfaces.DecodedJWT
import features.users.UserService
import io.javalin.Javalin
import io.javalin.core.security.Role
import javalinjwt.JavalinJWT


internal enum class Roles : Role {
    ANYONE, USER,
}

const val USER_LEVEL = "level"
const val EMAIL = "email"

fun addAuth(app: Javalin, service: UserService) {
    // decrypt JWT
    app.before(JavalinJWT.createHeaderDecodeHandler(service.provider))

    // Read email from JWT and add it to ctx for easier access in controller
    app.before { ctx ->
        if (JavalinJWT.containsJWT(ctx)) {
            val jwt = ctx.attribute<DecodedJWT>("jwt")
            val mail = jwt!!.getClaim(EMAIL)
            if (!mail.isNull) {
                ctx.attribute(EMAIL, mail.asString())
            }
        }
    }
}

