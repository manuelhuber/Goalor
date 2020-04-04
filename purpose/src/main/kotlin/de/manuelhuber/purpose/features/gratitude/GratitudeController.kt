package de.manuelhuber.purpose.features.gratitude

import com.google.inject.Inject
import de.manuelhuber.annotations.*
import de.manuelhuber.purpose.features.gratitude.model.Gratitude
import de.manuelhuber.purpose.lib.controller.getRequesterId
import de.manuelhuber.purpose.lib.engine.toId
import de.manuelhuber.purpose.lib.exceptions.ValidationError
import io.javalin.http.Context
import io.javalin.http.UploadedFile
import io.javalin.plugin.openapi.annotations.ContentType
import java.time.LocalDate

@APIController(path = "gratitude/")
class GratitudeController @Inject constructor(private val gratitudeService: GratitudeService) {

    @Post

    @Authorized
    fun createGratitude(ctx: Context, @BodyParam(ContentType.FORM_DATA_MULTIPART) x: GratitudeData): Gratitude {
        x.image?.let {
            if (!it.contentType.contains("image")) throw ValidationError("Wrong filetype: only images are supported")
        }
        return gratitudeService.createGratitude(x, ctx.getRequesterId())
    }

    @Get
    @Authorized
    fun getGratitudesForOwner(ctx: Context): List<Gratitude> {
        return gratitudeService.getGoalsByOwner(ctx.getRequesterId())
    }

    @Delete(":id")
    @Authorized
    fun deleteGratitude(ctx: Context) {
        gratitudeService.deleteGratitude(ctx.pathParam("id").toId(), ctx.getRequesterId())
    }

    @Put(":id")
    @Authorized
    fun updateGratitude(ctx: Context, data: GratitudeData): Gratitude {
        // TODO allow image update
        return gratitudeService.updateGoal(ctx.pathParam("id").toId(), data, ctx.getRequesterId())
    }

}

class GratitudeData(val title: String,
                    val description: String?,
                    val date: LocalDate,
                    @FileUpload("image") val image: UploadedFile?)
