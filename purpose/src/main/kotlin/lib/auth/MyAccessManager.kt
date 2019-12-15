package lib.auth

import io.javalin.core.security.AccessManager
import io.javalin.core.security.Role
import io.javalin.http.Context
import io.javalin.http.Handler
import javalinjwt.JavalinJWT

class MyAccessManager : AccessManager {

    override fun manage(handler: Handler, ctx: Context, permittedRoles: MutableSet<Role>) {
        if (permittedRoles.size == 0 || permittedRoles.contains(Roles.ANYONE)) {
            handler.handle(ctx)
            return
        }
        if (JavalinJWT.containsJWT(ctx)) {
            val jwt = JavalinJWT.getDecodedFromContext(ctx)
            val role = jwt.getClaim(USER_LEVEL)
            if (!role.isNull && permittedRoles.any { r -> r.toString() == role.asString() }) {
                handler.handle(ctx)
                return
            }
        }
        ctx.status(401)
            .result("Unauthorized")
    }

}
