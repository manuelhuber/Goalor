package de.manuelhuber.purpose.app

import com.google.inject.Guice
import com.google.inject.Injector
import de.manuelhuber.purpose.features.aspects.AspectsControllerWrapper
import de.manuelhuber.purpose.features.auth.AuthControllerWrapper
import de.manuelhuber.purpose.features.auth.AuthService
import de.manuelhuber.purpose.features.auth.MyAccessManager
import de.manuelhuber.purpose.features.auth.addAuth
import de.manuelhuber.purpose.features.auth.models.WrongPassword
import de.manuelhuber.purpose.features.users.UserControllerWrapper
import de.manuelhuber.purpose.features.users.UserService
import de.manuelhuber.purpose.lib.engine.NotFound
import dev.misfitlabs.kotlinguice4.getInstance
import io.javalin.Javalin
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
    hackSwaggerDoc(app)
    app.exception(Exception::class.java) { exception, _ ->
        logger?.error("uncaught", exception)
    }
        .exception(NotFound::class.java) { exception, ctx ->
            logger?.info(exception.message)
            ctx.status(404)
                .result(exception.message.orEmpty())
        }
        .exception(WrongPassword::class.java) { _, ctx -> ctx.status(401).result("Wrong password") }

    val injector = Guice.createInjector(GuiceModule())
    addAuth(app, injector.getInstance<AuthService>().provider, injector.getInstance<UserService>())
    createRoutes(app, injector)
}

fun createRoutes(app: Javalin, injector: Injector) {
    val controllers = listOf(AuthControllerWrapper::class,
            AspectsControllerWrapper::class,
            UserControllerWrapper::class)
    controllers.forEach { kClass ->
        val instance = injector.getInstance(kClass.java)
        instance.addRoutes(app)
    }
}
