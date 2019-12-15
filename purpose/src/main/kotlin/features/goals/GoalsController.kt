package features.goals

import app.Foo
import io.javalin.http.Context
import io.javalin.plugin.openapi.annotations.OpenApi
import io.javalin.plugin.openapi.annotations.OpenApiContent
import io.javalin.plugin.openapi.annotations.OpenApiRequestBody
import io.javalin.plugin.openapi.annotations.OpenApiResponse

class GoalsController(val engine: GoalsEngine) {


    @OpenApi(responses = [OpenApiResponse(status = "200", content = [OpenApiContent(from = Foo::class)])])
    fun getFoos(ctx: Context) {
        ctx.json("Many foos")
    }

    @OpenApi(requestBody = OpenApiRequestBody(content = [OpenApiContent(from = Foo::class)]),
            responses = [OpenApiResponse(status = "200", content = [OpenApiContent(from = Foo::class)])])
    fun createFoo(ctx: Context) {
        val foo = ctx.body<Foo>()
        print(foo)
    }
}
