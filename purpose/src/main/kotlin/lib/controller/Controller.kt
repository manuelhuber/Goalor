package lib.controller

import io.javalin.Javalin

abstract class Controller {
    abstract fun addRoutes(app: Javalin)
}
