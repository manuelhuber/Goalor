package de.manuelhuber.purpose.app

import com.fasterxml.jackson.databind.type.ArrayType
import com.fasterxml.jackson.databind.type.CollectionType
import de.manuelhuber.purpose.lib.controller.ErrorResponse
import de.manuelhuber.purpose.lib.engine.Id
import io.javalin.Javalin
import io.javalin.core.JavalinConfig
import io.javalin.http.UploadedFile
import io.javalin.plugin.openapi.ModelConverterFactory
import io.javalin.plugin.openapi.OpenApiOptions
import io.javalin.plugin.openapi.OpenApiPlugin
import io.javalin.plugin.openapi.jackson.JacksonToJsonMapper
import io.javalin.plugin.openapi.ui.SwaggerOptions
import io.swagger.v3.core.converter.AnnotatedType
import io.swagger.v3.core.converter.ModelConverter
import io.swagger.v3.core.converter.ModelConverterContext
import io.swagger.v3.core.jackson.ModelResolver
import io.swagger.v3.core.util.PrimitiveType
import io.swagger.v3.oas.models.info.Info
import io.swagger.v3.oas.models.media.ArraySchema
import io.swagger.v3.oas.models.media.Schema
import io.swagger.v3.oas.models.media.StringSchema

/**
 * Custom converter to create doc for [Id] as a regular string
 */
object ModelConverter : ModelConverter {
    private val default = ModelResolver(JacksonToJsonMapper.defaultObjectMapper)

    override fun resolve(type: AnnotatedType?,
                         context: ModelConverterContext?,
                         chain: MutableIterator<ModelConverter>?): Schema<*> {
        // Return Collection<Id> as Collection<String> (Single Ids work out of the box)
        return if (type?.type is CollectionType && (type.type as CollectionType).contentType.typeName.contains(Id::class.java.name)) {
            ArraySchema().items(PrimitiveType.STRING.createProperty())
        } else if (type?.type?.typeName?.contains(UploadedFile::class.java.name)!!) {
            return StringSchema().format("binary")
        } else if (type?.type is ArrayType && ((type.type as ArrayType).contentType.typeName == "[simple type, class byte]")) {
            return StringSchema().format("binary")
        } else {
            default.resolve(type, context, chain)
        }
    }
}

object ModelConverterFactory : ModelConverterFactory {
    override fun create(): ModelConverter {
        return ModelConverter
    }
}

fun addSwagger(conf: JavalinConfig) {

    val applicationInfo = Info().version("1.0").description("My Application").title("Purpose")

    val openApiPlugin = OpenApiOptions(applicationInfo).path("/api/swagger-docs")
        .swagger(SwaggerOptions("/api/swagger").title("My Swagger Documentation"))
    openApiPlugin.defaultDocumentation { documentation ->
        documentation.json("default", ErrorResponse::class.java)
    }.modelConverterFactory(ModelConverterFactory)

    conf.registerPlugin(OpenApiPlugin(openApiPlugin))
}


// Add support for JWT
fun hackSwaggerDoc(app: Javalin) {
    app.after("/api/swagger-docs") { ctx ->
        val resultString = ctx.resultString()!!.toString()
        val additionalComponent = """
            "security": [
                {"bearerAuth": []}
            ],
            "components": {
                "securitySchemes": {
                    "bearerAuth": {
                        "type": "http",
                        "scheme": "bearer",
                        "bearerFormat": "JWT"
                    }
                },
            """
        ctx.result(resultString.replace("\"components\":{", additionalComponent))
    }
}
