package de.manuelhuber.purpose.features.habits

import com.google.inject.Inject
import de.manuelhuber.annotations.*
import de.manuelhuber.purpose.features.habits.model.Habit
import de.manuelhuber.purpose.features.habits.model.HabitRequest
import de.manuelhuber.purpose.features.habits.model.HabitValue
import de.manuelhuber.purpose.features.habits.model.HabitValueRequest
import de.manuelhuber.purpose.lib.controller.getRequesterId
import de.manuelhuber.purpose.lib.engine.toId
import io.javalin.http.Context
import java.time.LocalDate

@APIController("habits")
class HabitController @Inject constructor(val service: HabitService) {

    @Get
    @Authorized
    fun getHabits(ctx: Context, @QueryParam from: LocalDate, @QueryParam to: LocalDate): HabitResponse {
        val owner = ctx.getRequesterId()
        val habits = service.getHabits(owner)
        val habitValues = service.getHabitValues(owner, from, to).mapValues { entry ->
            entry.value.fold(mutableMapOf<String, Int>()) { acc, habitValue ->
                acc[habitValue.habit.value] = habitValue.value
                acc
            }
        }
        return HabitResponse(habits, habitValues)
    }

    @Post
    @Authorized
    fun createHabit(ctx: Context, habit: HabitRequest): Habit {
        return service.createHabit(habit, ctx.getRequesterId())
    }

    @Post("/:habit")
    @Authorized
    fun addValue(ctx: Context, habit: HabitValueRequest): HabitValue {
        return service.addValue(ctx.pathParam("habit").toId(), habit, ctx.getRequesterId())
    }

    @Delete("/:habit")
    @Authorized
    fun deleteHabit(ctx: Context) {
        service.deleteHabit(ctx.getRequesterId(), ctx.pathParam("habit").toId())
    }

    @Put("/:habit")
    @Authorized
    fun updateHabit(ctx: Context, habit: HabitRequest): Habit {
        return service.updateHabit(ctx.getRequesterId(), ctx.pathParam("habit").toId(), habit)
    }

}

data class HabitResponse(val habits: List<Habit>, val dateValue: Map<LocalDate, Map<String, Int>>)
