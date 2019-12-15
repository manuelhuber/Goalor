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


fun main(args: Array<String>) {
    val app = Javalin.create { config ->
        addSwagger(config)
        config.accessManager(MyAccessManager())
    }
        .start(7000)
    val injector = Guice.createInjector(MyModule())

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

