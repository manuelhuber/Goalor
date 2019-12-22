package de.manuelhuber.purpose.app

import de.manuelhuber.purpose.features.auth.models.NotAuthorized
import de.manuelhuber.purpose.features.auth.models.WrongPassword
import de.manuelhuber.purpose.lib.engine.NotFound
import io.javalin.Javalin
import org.slf4j.Logger

// TODO use ErrorResponse
fun addErrorHandling(app: Javalin, logger: Logger) {
    app
        .exception(Exception::class.java) { exception, _ ->
            logger.error("uncaught", exception)
        }
        .exception(NotFound::class.java) { exception, ctx ->
            logger.info(exception.message)
            ctx.status(404)
                .result(exception.message.orEmpty())
        }
        .exception(WrongPassword::class.java) { _, ctx -> ctx.status(401).result("Wrong password") }
        .exception(NotAuthorized::class.java) { exception, ctx -> ctx.status(401).result(exception.message) }
}
