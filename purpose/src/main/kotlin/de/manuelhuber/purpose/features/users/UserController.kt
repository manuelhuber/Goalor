package de.manuelhuber.purpose.features.users

import com.google.inject.Inject
import de.manuelhuber.annotations.*
import de.manuelhuber.purpose.features.auth.AuthService
import de.manuelhuber.purpose.features.auth.Claims
import de.manuelhuber.purpose.features.auth.models.NotAuthorized
import de.manuelhuber.purpose.features.users.models.*
import de.manuelhuber.purpose.lib.controller.getRequesterId
import io.javalin.http.Context
import javalinjwt.examples.JWTResponse

@APIController("user")
class UserController @Inject constructor(private val service: UserService, private val authService: AuthService) {

    @Post("register")
    fun register(reg: Registration): RegistrationResponse {
        val user = service.register(reg)
        val token = authService.login(user.username, reg.password)
        return RegistrationResponse(UserTO.fromUser(user), token)
    }

    @Post("password")
    fun updatePw(ctx: Context, passwordUpdate: PasswordUpdate): JWTResponse {
        val user = ctx.attribute<User>(Claims.USER.name)
        val username = passwordUpdate.username

        return JWTResponse(service.updatePassword(
                user?.let { it.username } ?: username?.let { Username(it) } ?: throw NotAuthorized(),
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
