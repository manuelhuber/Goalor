package de.manuelhuber.purpose.features.gratitude

import com.google.inject.Inject
import de.manuelhuber.annotations.*
import de.manuelhuber.purpose.features.gratitude.model.Gratitude
import de.manuelhuber.purpose.lib.controller.getId
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
    fun createNewGoal(ctx: Context, file: UploadedFile?) {
        val title = ctx.formParam("title") ?: throw ValidationError("Required field missing: title")
        val dateString = ctx.formParam("date") ?: throw ValidationError("Required field missing: date")
        val date = try {
            LocalDate.parse(dateString)
        } catch (e: DateTimeParseException) {
            throw ValidationError("Date couldn't be parsed: $dateString")
        }
        file?.let { if (!it.contentType.contains("image")) throw ValidationError("Wrong filetype: only images are supported") }
        val description = ctx.formParam("description")
        gratitudeService.createGratitude(
                GratitudeData(title, description, date),
                file,
                ctx.getId()
        )
    }

    @Get
    fun getGoalsForOwner(ctx: Context): List<Gratitude> {
        return gratitudeService.getGoalsByOwner(ctx.getId())
    }

}

data class GratitudeData(val title: String, val description: String?, val date: LocalDate)
