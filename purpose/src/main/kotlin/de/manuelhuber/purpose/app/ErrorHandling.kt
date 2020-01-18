package de.manuelhuber.purpose.app

import de.manuelhuber.purpose.features.auth.models.NotAuthorized
import de.manuelhuber.purpose.features.auth.models.WrongPassword
import de.manuelhuber.purpose.lib.controller.ErrorResponse
import de.manuelhuber.purpose.lib.exceptions.NotFound
import de.manuelhuber.purpose.lib.exceptions.ValidationError
import io.javalin.Javalin
import org.slf4j.Logger

fun addErrorHandling(app: Javalin, logger: Logger) {
    app
        .exception(Exception::class.java) { exception, ctx ->
            logger.error("uncaught", exception)
            ctx.status(500).json(ErrorResponse(exception.message ?: ""))
        }
        .exception(NotFound::class.java) { exception, ctx ->
            logger.info(exception.message)
            ctx.status(404)
                .json(ErrorResponse(exception.message.orEmpty()))
        }
        .exception(ValidationError::class.java) { exception, ctx ->
            logger.info(exception.message)
            ctx.status(400)
                .json(ErrorResponse(exception.message.orEmpty()))
        }
        .exception(WrongPassword::class.java) { _, ctx -> ctx.status(401).json(ErrorResponse("Wrong password")) }
        .exception(NotAuthorized::class.java) { exception, ctx ->
            ctx.status(401)
                .json(ErrorResponse(exception.message))
        }
}
