package app

import com.google.inject.Guice
import com.google.inject.Injector
import dev.misfitlabs.kotlinguice4.getInstance
import features.users.UserController
import features.users.UserService
import io.javalin.Javalin
import io.javalin.apibuilder.ApiBuilder.get
import io.javalin.apibuilder.ApiBuilder.post
import io.javalin.core.security.SecurityUtil.roles
import lib.auth.MyAccessManager
import lib.auth.Roles
import lib.auth.addAuth
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
    }
        .start(7000)
    val injector = Guice.createInjector(MyModule())
    app.exception(Exception::class.java) { exception, ctx ->
        logger?.error("uncaught", exception)
    }
        .exception(NotFound::class.java) { exception, ctx ->
            logger?.info(exception.message)
            ctx.status(404)
        }

    val userService = injector.getInstance<UserService>()
    addAuth(app, userService)
    createRoutes(app, userService, injector)
}

fun createRoutes(app: Javalin, userService: UserService, injector: Injector) {
    val userController = injector.getInstance<UserController>()
    app.routes {
        get("/users/me", userController::getUser, roles(Roles.USER))
        post("/register", userController::register)
        post("/login", userController::login)
    }
}

