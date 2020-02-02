package de.manuelhuber.purpose.features.users

import com.google.inject.Inject
import de.manuelhuber.annotations.*
import de.manuelhuber.purpose.features.auth.AuthService
import de.manuelhuber.purpose.features.users.models.Registration
import de.manuelhuber.purpose.features.users.models.RegistrationResponse
import de.manuelhuber.purpose.features.users.models.User
import de.manuelhuber.purpose.features.users.models.UserTO
import de.manuelhuber.purpose.lib.controller.getRequesterId
import io.javalin.http.Context
import javalinjwt.examples.JWTResponse

@APIController("user")
class UserController @Inject constructor(private val service: UserService, private val authService: AuthService) {

    @Post("register")
    fun register(ctx: Context, reg: Registration): RegistrationResponse {
        val user = service.register(reg)
        val token = authService.login(user.username, reg.password)
        return RegistrationResponse(UserTO.fromUser(user), token)
    }

    @Post("password")
    @Authorized
    fun updatePw(ctx: Context, passwordUpdate: PasswordUpdate): JWTResponse {
        return JWTResponse(service.updatePassword(ctx.getRequesterId(),
                passwordUpdate.pw,
                passwordUpdate.old,
                passwordUpdate.token))
    }

    @Get
    @Authorized
    fun getUser(ctx: Context): UserTO {
        val user = service.getUserById(ctx.getRequesterId())
        return UserTO.fromUser(user)
    }

    @Put
    @Authorized
    fun updateUser(ctx: Context, userTO: UserTO): User {
        return service.updateUser(ctx.getRequesterId(), userTO)
    }
}

data class PasswordUpdate(val old: String?, val token: String?, val pw: String)

