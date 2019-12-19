package features.aspects

import io.javalin.Javalin
import lib.controller.Controller

class AspectsController(val engine: AspectsEngine) : Controller() {
    override fun addRoutes(app: Javalin) {

    }


}
