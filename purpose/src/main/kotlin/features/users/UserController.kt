package features.users

import com.google.inject.Inject
import features.users.models.Login
import features.users.models.Registration
import features.users.models.User
import io.javalin.http.Context
import io.javalin.plugin.openapi.annotations.OpenApi
import io.javalin.plugin.openapi.annotations.OpenApiContent
import io.javalin.plugin.openapi.annotations.OpenApiRequestBody
import io.javalin.plugin.openapi.annotations.OpenApiResponse
import javalinjwt.examples.JWTResponse
import lib.auth.WrongPassword
import lib.engine.NotFound

class UserController @Inject constructor(private val service: UserService) {

    @OpenApi(requestBody = OpenApiRequestBody(content = [OpenApiContent(from = Registration::class)]),
            responses = [OpenApiResponse(status = "200",
                    content = [OpenApiContent(from = RegistrationResponse::class)])])
    fun register(ctx: Context) {
        val foo = ctx.body<Registration>()
        val user = service.register(foo)
        val token = service.login(user.email, foo.password)
        ctx.json(RegistrationResponse(UserTO.fromUser(user), token))
    }

    @OpenApi(requestBody = OpenApiRequestBody(content = [OpenApiContent(from = Login::class)]),
            responses = [OpenApiResponse(status = "200", content = [OpenApiContent(from = JWTResponse::class)])])
    fun login(ctx: Context) {
        try {
            ctx.json(JWTResponse(service.login(ctx.body<Login>().email, ctx.body<Login>().password)))
        } catch (e: Exception) {
            when (e) {
                is WrongPassword, is NotFound -> {
                    ctx.res.status = 401
                }
                else -> throw e
            }
        }
    }

    @OpenApi(responses = [OpenApiResponse(status = "200", content = [OpenApiContent(from = UserTO::class)])])
    fun getUser(ctx: Context) {
        val user = ctx.attribute<String>("email")
            ?.let { service.getUser(it) }
        if (user == null) {
            ctx.status(404)
                .result("Account not found")
        } else {
            ctx.json(UserTO.fromUser(user))
        }
    }
}

data class UserTO(val email: String, val id: String) {
    companion object {
        fun fromUser(user: User): UserTO {
            return UserTO(user.email, user.id)
        }
    }
}

data class RegistrationResponse(val user: UserTO, val token: String)
