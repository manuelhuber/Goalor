package de.manuelhuber.purpose.features.aspects

import com.google.inject.Inject
import de.manuelhuber.annotations.APIController
import de.manuelhuber.annotations.Authorized
import de.manuelhuber.annotations.Get
import de.manuelhuber.annotations.Post
import de.manuelhuber.purpose.features.auth.models.Login
import io.javalin.http.Context

@APIController(path = "aspects/")
class AspectsController @Inject constructor(val engine: AspectsEngine) {

    @Get("/1", roles = ["de.manuelhuber.annotations.Roles.USER"])
    fun foobar1(): Int {
        return 42
    }

    @Post("/2")
    @Authorized
    fun foobar2(ctx: Context): String {
        return "Hi"
    }

    @Post("/3")
    fun foobar3(ctx: Context, login: Login) {
    }

}
