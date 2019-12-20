package de.manuelhuber.annotations

import io.javalin.Javalin

interface Controller {
    fun addRoutes(app: Javalin)
}
