package features.users

import features.users.models.Login
import features.users.models.Registration
import features.users.models.User
import io.javalin.http.Context
import io.javalin.plugin.openapi.annotations.OpenApi
import io.javalin.plugin.openapi.annotations.OpenApiContent
import io.javalin.plugin.openapi.annotations.OpenApiRequestBody
import io.javalin.plugin.openapi.annotations.OpenApiResponse
import javalinjwt.examples.JWTResponse
import lib.engine.NotFound

class UserController(private val service: UserService) {

    @OpenApi(requestBody = OpenApiRequestBody(content = [OpenApiContent(from = Registration::class)]),
            responses = [OpenApiResponse(status = "200", content = [OpenApiContent(from = User::class)])])
    fun register(ctx: Context) {
        val foo = ctx.body<Registration>()
        ctx.json(service.register(foo))
    }

    @OpenApi(requestBody = OpenApiRequestBody(content = [OpenApiContent(from = Login::class)]),
            responses = [OpenApiResponse(status = "200", content = [OpenApiContent(from = JWTResponse::class)])])
    fun login(ctx: Context) {
        try {
            ctx.json(JWTResponse(service.login(ctx.body<Login>())))
        } catch (e: NotFound) {
            ctx.res.status = 404
        }
    }

    fun getUser(ctx: Context) {
        val user = ctx.attribute<String>("email")
            ?.let { service.getUser(it) }
        if (user == null) {
            ctx.status(404)
                .result("Account not found")
        } else {
            ctx.json(user)
        }
    }
}



