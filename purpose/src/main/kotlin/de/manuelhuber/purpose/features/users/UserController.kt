package de.manuelhuber.purpose.features.users

import com.google.inject.Inject
import de.manuelhuber.annotations.APIController
import de.manuelhuber.annotations.Get
import de.manuelhuber.annotations.Post
import de.manuelhuber.purpose.features.auth.AuthService
import de.manuelhuber.purpose.features.users.models.Registration
import de.manuelhuber.purpose.features.users.models.RegistrationResponse
import de.manuelhuber.purpose.features.users.models.UserTO
import de.manuelhuber.purpose.lib.controller.getId
import io.javalin.http.Context

@APIController("user")
class UserController @Inject constructor(private val service: UserService, private val authService: AuthService) {

    @Post("register")
    fun register(ctx: Context, reg: Registration): RegistrationResponse {
        val user = service.register(reg)
        val token = authService.login(user.username, reg.password)
        return RegistrationResponse(UserTO.fromUser(user), token)
    }

    @Get("me")
    fun getUser(ctx: Context): UserTO {
        val user = service.getUserById(ctx.getId())
        return UserTO.fromUser(user)
    }
}

