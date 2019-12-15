package app

import io.javalin.core.JavalinConfig
import io.javalin.plugin.openapi.OpenApiOptions
import io.javalin.plugin.openapi.OpenApiPlugin
import io.javalin.plugin.openapi.ui.SwaggerOptions
import io.swagger.v3.oas.models.info.Info

fun addSwagger(conf: JavalinConfig) {

    val applicationInfo = Info().version("1.0")
        .description("My Application")

    val openApiPlugin = OpenApiOptions(applicationInfo).path("/swagger-docs")
        .swagger(SwaggerOptions("/swagger").title("My Swagger Documentation"))

    conf.registerPlugin(OpenApiPlugin(openApiPlugin))
}
