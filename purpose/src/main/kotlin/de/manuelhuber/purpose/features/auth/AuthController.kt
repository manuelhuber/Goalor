package de.manuelhuber.purpose.features.auth

import com.google.inject.Inject
import de.manuelhuber.annotations.APIController
import de.manuelhuber.annotations.Get
import de.manuelhuber.purpose.features.auth.models.Login
import de.manuelhuber.purpose.features.auth.models.WrongPassword
import de.manuelhuber.purpose.lib.engine.NotFound
import io.javalin.http.Context
import javalinjwt.examples.JWTResponse

@APIController
class AuthController @Inject constructor(private val service: AuthService) {
//
//    override fun addRoutes(app: Javalin) {
//        app.routes {
//            ApiBuilder.post("/login", this::login)
//        }
//    }


    @Get("/login")
    fun login(ctx: Context, login: Login): JWTResponse {
        try {
            return JWTResponse(service.login(login.username, login.password))
        } catch (e: Exception) {
            when (e) {
                is WrongPassword, is NotFound -> {
                    ctx.status(401)
                            .result("Wrong username / password")
                    throw e
                }
                else -> throw e
            }
        }
    }
}

