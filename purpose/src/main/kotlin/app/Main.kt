package app

import io.javalin.Javalin
import io.javalin.apibuilder.ApiBuilder.get
import io.javalin.apibuilder.ApiBuilder.post
import io.javalin.http.Context
import io.javalin.plugin.openapi.OpenApiOptions
import io.javalin.plugin.openapi.OpenApiPlugin
import io.javalin.plugin.openapi.annotations.OpenApi
import io.javalin.plugin.openapi.annotations.OpenApiContent
import io.javalin.plugin.openapi.annotations.OpenApiRequestBody
import io.javalin.plugin.openapi.annotations.OpenApiResponse
import io.javalin.plugin.openapi.ui.SwaggerOptions
import io.swagger.v3.oas.models.info.Info


fun main(args: Array<String>) {
    val applicationInfo = Info()
        .version("1.0")
        .description("My Application")
    val openApiPlugin = OpenApiOptions(applicationInfo)
        .path("/swagger-docs")
        .swagger(
            SwaggerOptions("/swagger").title("My Swagger Documentation")
        )
    val app = Javalin.create { config ->
        config.registerPlugin(OpenApiPlugin(openApiPlugin))
    }.start(7000)
    createRoutes(app)
}

fun createRoutes(app: Javalin) {
    val foo = FooController()
    app.routes {
        get("/foo", foo::getFoos)
        post("/foo", foo::createFoo)
    }
}

internal class FooController {
    @OpenApi(
        responses = [OpenApiResponse(status = "200", content = [OpenApiContent(from = Foo::class)])]
    )
    fun getFoos(ctx: Context) {
        ctx.json("Many foos")
    }

    @OpenApi(
        requestBody = OpenApiRequestBody(content = [OpenApiContent(from = Foo::class)]),
        responses = [OpenApiResponse(status = "200", content = [OpenApiContent(from = Foo::class)])]
    )
    fun createFoo(ctx: Context) {
        val foo = ctx.body<Foo>()
        print(foo)
    }
}


data class Foo(val bar: String, val baz: Int)