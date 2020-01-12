package de.manuelhuber.purpose.features.goals

import com.google.inject.Inject
import de.manuelhuber.annotations.*
import de.manuelhuber.purpose.features.auth.Claims
import de.manuelhuber.purpose.features.goals.model.Goal
import de.manuelhuber.purpose.features.goals.model.GoalData
import de.manuelhuber.purpose.features.users.models.User
import de.manuelhuber.purpose.lib.controller.getId
import de.manuelhuber.purpose.lib.engine.Id
import io.javalin.http.Context

@APIController(path = "goals/")
class GoalController @Inject constructor(private val service: GoalService) {

    @Get
    @Authorized
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
        service.deleteGoal(Id(ctx.pathParam("id")), ctx.getId())
    }

    @Put(":id")
    @Authorized
    fun updateGoal(ctx: Context, aspect: GoalData): Goal {
        return service.updateGoal(Id(ctx.pathParam("id")), aspect, ctx.getId())
    }

}

