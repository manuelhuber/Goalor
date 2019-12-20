package de.manuelhuber.purpose.features.users

import com.google.inject.Inject
import de.manuelhuber.annotations.Controller
import de.manuelhuber.purpose.features.auth.AuthService
import de.manuelhuber.purpose.features.auth.Roles
import de.manuelhuber.purpose.features.users.models.Registration
import de.manuelhuber.purpose.features.users.models.RegistrationResponse
import de.manuelhuber.purpose.features.users.models.User
import de.manuelhuber.purpose.features.users.models.UserTO
import de.manuelhuber.purpose.lib.engine.NotFound
import io.javalin.Javalin
import io.javalin.apibuilder.ApiBuilder.get
import io.javalin.apibuilder.ApiBuilder.post
import io.javalin.core.security.SecurityUtil
import io.javalin.http.Context
import io.javalin.plugin.openapi.annotations.OpenApi
import io.javalin.plugin.openapi.annotations.OpenApiContent
import io.javalin.plugin.openapi.annotations.OpenApiRequestBody
import io.javalin.plugin.openapi.annotations.OpenApiResponse

class UserController @Inject constructor(private val service: UserService, private val authService: AuthService) :
        Controller {

    override fun addRoutes(app: Javalin) {
        app.routes {
            get("/users/me", this::getUser, SecurityUtil.roles(Roles.USER))
            post("/register", this::register)
        }
    }

    @OpenApi(requestBody = OpenApiRequestBody(content = [OpenApiContent(from = Registration::class)]),
            responses = [OpenApiResponse(status = "200",
                    content = [OpenApiContent(from = RegistrationResponse::class)])])
    fun register(ctx: Context) {
        val reg = ctx.body<Registration>()
        val user = service.register(reg)
        val token = authService.login(user.email, reg.password)
        ctx.json(RegistrationResponse(UserTO.fromUser(
                user), token))
    }

    @OpenApi(responses = [OpenApiResponse(status = "200", content = [OpenApiContent(from = UserTO::class)])])
    fun getUser(ctx: Context) {
        val mail = ctx.attribute<String>("email")
        val user = mail?.let { service.getUserByUsername(it) }
        if (user == null) {
            throw NotFound(mail.orEmpty(), User::class, "email")
        } else {
            ctx.json(UserTO.fromUser(user))
        }
    }
}

