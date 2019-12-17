package features.auth

import com.google.inject.Inject
import features.auth.models.Login
import features.auth.models.WrongPassword
import io.javalin.Javalin
import io.javalin.apibuilder.ApiBuilder
import io.javalin.http.Context
import io.javalin.plugin.openapi.annotations.OpenApi
import io.javalin.plugin.openapi.annotations.OpenApiContent
import io.javalin.plugin.openapi.annotations.OpenApiRequestBody
import io.javalin.plugin.openapi.annotations.OpenApiResponse
import javalinjwt.examples.JWTResponse
import lib.controller.Controller
import lib.engine.NotFound

class AuthController @Inject constructor(private val service: AuthService) : Controller() {

    override fun addRoutes(app: Javalin) {
        app.routes {
            ApiBuilder.post("/login", this::login)
        }
    }

    @OpenApi(requestBody = OpenApiRequestBody(content = [OpenApiContent(from = Login::class)]),
            responses = [OpenApiResponse(status = "200", content = [OpenApiContent(from = JWTResponse::class)])])
    fun login(ctx: Context) {
        try {
            ctx.json(JWTResponse(service.login(ctx.body<Login>().username, ctx.body<Login>().password)))
        } catch (e: Exception) {
            when (e) {
                is WrongPassword, is NotFound -> {
                    ctx.res.status = 401
                }
                else -> throw e
            }
        }
    }
}

