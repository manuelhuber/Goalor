package app

import com.google.inject.Guice
import com.google.inject.Injector
import dev.misfitlabs.kotlinguice4.getInstance
import features.auth.AuthController
import features.auth.AuthService
import features.auth.MyAccessManager
import features.auth.addAuth
import features.users.UserController
import io.javalin.Javalin
import lib.engine.NotFound
import org.slf4j.LoggerFactory

private val logger: org.slf4j.Logger? = LoggerFactory.getLogger(Javalin::class.java)
fun main(args: Array<String>) {
    val app = Javalin.create { config ->
        addSwagger(config)
        config.accessManager(MyAccessManager())
        config.enableCorsForAllOrigins()
        config.requestLogger { ctx, ms ->
            logger?.info("{} - Request took {} ms", ctx.url(), ms)
            logger?.info("Response: {}", ctx.resultString())
        }
    }.start(7000)

    app.exception(Exception::class.java) { exception, _ ->
        logger?.error("uncaught", exception)
    }.exception(NotFound::class.java) { exception, ctx ->
        logger?.info(exception.message)
        ctx.status(404).result(exception.message.orEmpty())
    }

    val injector = Guice.createInjector(GuiceModule())
    addAuth(app, injector.getInstance<AuthService>().provider)
    createRoutes(app, injector)
}

fun createRoutes(app: Javalin, injector: Injector) {
    val controllers = listOf(UserController::class, AuthController::class)
    controllers.forEach { kClass -> injector.getInstance(kClass.java).addRoutes(app) }
}

