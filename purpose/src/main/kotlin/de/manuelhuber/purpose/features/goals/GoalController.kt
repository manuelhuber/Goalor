package de.manuelhuber.purpose.features.aspects

import com.google.inject.Inject
import de.manuelhuber.annotations.*
import de.manuelhuber.purpose.features.auth.Claims
import de.manuelhuber.purpose.features.users.models.User
import de.manuelhuber.purpose.lib.controller.getId
import io.javalin.http.Context

@APIController(path = "goals/")
class GoalController @Inject constructor(private val service: GoalService) {

    @Get
    fun getMyGoals(ctx: Context): List<Goal> {
        val owner = ctx.attribute<User>(Claims.USER.name)!!
        return service.getGoalsByOwner(owner.id)
    }

    @Post
    @Authorized
    fun createNewGoal(ctx: Context, create: GoalData): Goal {
        return service.createNewGoal(create, ctx.getId())
    }

    @Delete(":id")
    @Authorized
    fun deleteGoal(ctx: Context) {
        service.deleteGoal(ctx.pathParam("id"), ctx.getId())
    }

    @Put(":id")
    fun updateGoal(ctx: Context, aspect: GoalData): Goal {
        return service.updateGoal(ctx.pathParam("id"), aspect, ctx.getId())
    }

}

