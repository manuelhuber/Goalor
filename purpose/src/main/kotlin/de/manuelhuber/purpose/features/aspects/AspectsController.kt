package de.manuelhuber.purpose.features.aspects

import com.google.inject.Inject
import de.manuelhuber.annotations.*
import de.manuelhuber.purpose.features.aspects.model.Aspect
import de.manuelhuber.purpose.features.aspects.model.CreateAspect
import de.manuelhuber.purpose.features.auth.Claims
import de.manuelhuber.purpose.features.users.models.User
import de.manuelhuber.purpose.lib.controller.getRequesterId
import de.manuelhuber.purpose.lib.engine.Id
import io.javalin.http.Context

@APIController(path = "aspects/")
class AspectsController @Inject constructor(private val service: AspectService) {

    @Get
    @Authorized
    fun getMyAspects(ctx: Context): List<Aspect> {
        val owner = ctx.attribute<User>(Claims.USER.name)!!
        return service.getAspectsByOwner(owner.id)
    }

    @Post
    @Authorized
    fun createNewAspect(ctx: Context, create: CreateAspect): Aspect {
        return service.createNewAspect(create, ctx.getRequesterId())
    }

    @Delete(":id")
    @Authorized
    fun deleteAspect(ctx: Context) {
        service.deleteAspect(Id(ctx.pathParam("id")), ctx.getRequesterId())
    }

    @Put(":id")
    @Authorized
    fun updateAspect(ctx: Context, aspect: CreateAspect): Aspect {
        return service.updateAspect(Id(ctx.pathParam("id")), aspect, ctx.getRequesterId())
    }

}

