package de.manuelhuber.purpose.features.gratitude

import com.google.inject.Inject
import de.manuelhuber.annotations.APIConfig
import de.manuelhuber.annotations.APIController
import de.manuelhuber.annotations.FileUpload
import de.manuelhuber.annotations.Post
import de.manuelhuber.purpose.app.STATIC_FILE_FOLDER
import io.javalin.core.util.FileUtil
import io.javalin.http.Context
import io.javalin.http.UploadedFile
import java.lang.Exception

@APIController(path = "gratitude/")
class GratitudeController @Inject constructor() {
    @Post(":id")
    @FileUpload
    fun createNewGoal(ctx: Context, file: UploadedFile?) {
        val path = System.getenv(STATIC_FILE_FOLDER)
        FileUtil.streamToFile(file!!.content, path)
    }

}

data class GratitudeThing(val title: String, val description: String)

class FooEx : Exception()
