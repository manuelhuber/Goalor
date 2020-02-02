package de.manuelhuber.purpose.features.auth

import com.google.inject.Inject
import de.manuelhuber.annotations.APIController
import de.manuelhuber.annotations.Post
import de.manuelhuber.purpose.features.auth.models.Login
import de.manuelhuber.purpose.features.users.models.Username
import de.manuelhuber.purpose.lib.controller.getRequesterId
import io.javalin.http.Context
import javalinjwt.examples.JWTResponse

@APIController("auth")
class AuthController @Inject constructor(private val service: AuthService) {

    @Post("login")
    fun login(ctx: Context, login: Login): JWTResponse {
        return JWTResponse(service.login(login.username, login.password))
    }

    @Post("reset/:username")
    fun resetPassword(ctx: Context) {
        val username = ctx.pathParam("username")
        service.resetPassword(Username(username))
    }

    @Post("logout")
    fun logout(ctx: Context) {
        service.logout(ctx.getRequesterId())
    }
}

