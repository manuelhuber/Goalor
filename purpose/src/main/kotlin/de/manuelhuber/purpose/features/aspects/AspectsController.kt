package de.manuelhuber.purpose.features.aspects

import com.google.inject.Inject
import de.manuelhuber.annotations.APIController
import de.manuelhuber.annotations.Get
import de.manuelhuber.purpose.features.aspects.model.AspectsEngine
import de.manuelhuber.purpose.features.auth.Claims
import de.manuelhuber.purpose.features.users.models.User
import io.javalin.http.Context

@APIController(path = "aspects/")
class AspectsController @Inject constructor(private val engine: AspectsEngine) {

    @Get("")
    fun getMyAspects(ctx: Context): Array<Aspect> {
        val owner = ctx.attribute<User>(Claims.USER.name)!!
        return engine.getAllForOwner(owner.id).toTypedArray()
    }

}
