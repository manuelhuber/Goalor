package de.manuelhuber.purpose.features.auth

import de.manuelhuber.annotations.Roles
import de.manuelhuber.purpose.features.auth.models.NotAuthorized
import de.manuelhuber.purpose.features.users.UserService
import de.manuelhuber.purpose.lib.engine.Id
import io.javalin.core.security.AccessManager
import io.javalin.core.security.Role
import io.javalin.http.Context
import io.javalin.http.Handler
import javalinjwt.JavalinJWT
import java.time.LocalDateTime

class JWTAccessManager(val userService: UserService) : AccessManager {

    override fun manage(handler: Handler, ctx: Context, permittedRoles: MutableSet<Role>) {
        if (permittedRoles.size == 0 || permittedRoles.contains(Roles.ANYONE)) {
            handler.handle(ctx)
            return
        }
        if (JavalinJWT.containsJWT(ctx)) {
            val jwt = JavalinJWT.getDecodedFromContext(ctx)
            val role = jwt.getClaim(Claims.USER_LEVEL.name)
            val userID = jwt.getClaim(Claims.ID.name)
            val created = LocalDateTime.parse(jwt.getClaim(Claims.CREATED.name).asString())
            val user = userService.getUserById(Id(userID.asString()))
            val jwtValid = user.logout == null || user.logout.isBefore(created)
            if (!jwtValid) {
                throw NotAuthorized("Token no longer valid!")
            }
            if (role.isNull || !permittedRoles.any { r -> r.toString() == role.asString() }) {
                throw NotAuthorized("Insufficient permissions")
            } else {
                handler.handle(ctx)
                return
            }
        }
        throw NotAuthorized("Missing token")
    }

}
