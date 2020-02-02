package de.manuelhuber.purpose.features.habits

import com.google.inject.Inject
import de.manuelhuber.annotations.APIController
import de.manuelhuber.annotations.Get
import io.javalin.http.Context
import io.javalin.plugin.openapi.annotations.OpenApiParam
import java.time.LocalDate

@APIController("habits")
class HabitController @Inject constructor() {

    @Get("", queryParams = [OpenApiParam("limit", Int::class), OpenApiParam("from", LocalDate::class)])
    fun register(ctx: Context) {
        print(ctx.queryParam<LocalDate>("from"))
    }
}

