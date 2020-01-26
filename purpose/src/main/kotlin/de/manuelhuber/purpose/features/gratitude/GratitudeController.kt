package de.manuelhuber.purpose.features.gratitude

import com.google.inject.Inject
import de.manuelhuber.annotations.*
import de.manuelhuber.purpose.features.gratitude.model.Gratitude
import de.manuelhuber.purpose.lib.controller.getId
import de.manuelhuber.purpose.lib.engine.toId
import de.manuelhuber.purpose.lib.exceptions.ValidationError
import io.javalin.http.Context
import io.javalin.http.UploadedFile
import java.time.LocalDate
import java.time.format.DateTimeParseException

@APIController(path = "gratitude/")
class GratitudeController @Inject constructor(private val gratitudeService: GratitudeService) {

    @Post
    @FileUpload
    @Authorized
    fun createGratitude(ctx: Context, file: UploadedFile?): Gratitude {
        val title = ctx.formParam("title") ?: throw ValidationError("Required field missing: title")
        val dateString = ctx.formParam("date") ?: throw ValidationError("Required field missing: date")
        val date = try {
            LocalDate.parse(dateString)
        } catch (e: DateTimeParseException) {
            throw ValidationError("Date couldn't be parsed: $dateString")
        }
        file?.let {
            if (!it.contentType.contains("image")) throw ValidationError("Wrong filetype: only images are supported")
        }
        val description = ctx.formParam("description")
        return gratitudeService.createGratitude(GratitudeData(title, description, date), file, ctx.getId())
    }

    @Get
    @Authorized
    fun getGratitudesForOwner(ctx: Context): List<Gratitude> {
        return gratitudeService.getGoalsByOwner(ctx.getId())
    }

    @Delete(":id")
    @Authorized
    fun deleteGratitude(ctx: Context) {
        gratitudeService.deleteGratitude(ctx.pathParam("id").toId(), ctx.getId())
    }

    @Put(":id")
    @Authorized
    fun updateGratitude(ctx: Context, data: GratitudeData): Gratitude {
        return gratitudeService.updateGoal(ctx.pathParam("id").toId(), data, ctx.getId())
    }

}

data class GratitudeData(val title: String, val description: String?, val date: LocalDate)
