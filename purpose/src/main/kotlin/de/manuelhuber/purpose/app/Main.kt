package de.manuelhuber.purpose.app

import com.google.inject.Guice
import com.google.inject.Injector
import de.manuelhuber.purpose.features.aspects.AspectsControllerWrapper
import de.manuelhuber.purpose.features.auth.AuthControllerWrapper
import de.manuelhuber.purpose.features.auth.AuthService
import de.manuelhuber.purpose.features.auth.MyAccessManager
import de.manuelhuber.purpose.features.auth.addAuth
import de.manuelhuber.purpose.features.goals.GoalControllerWrapper
import de.manuelhuber.purpose.features.gratitude.GratitudeControllerWrapper
import de.manuelhuber.purpose.features.users.UserControllerWrapper
import dev.misfitlabs.kotlinguice4.getInstance
import io.javalin.Javalin
import io.javalin.http.staticfiles.Location
import io.javalin.plugin.json.FromJsonMapper
import io.javalin.plugin.json.JavalinJson.fromJsonMapper
import io.javalin.plugin.json.JavalinJson.toJsonMapper
import io.javalin.plugin.json.ToJsonMapper
import org.slf4j.LoggerFactory

private val logger: org.slf4j.Logger = LoggerFactory.getLogger(Javalin::class.java)

const val STATIC_FILE_FOLDER = "static_folder"

fun main() {
    val injector = Guice.createInjector(GuiceModule())
    injector.getInstance<DatabaseInitiator>().init()

    val app = Javalin.create { config ->
        addSwagger(config)
        config.accessManager(MyAccessManager())
        config.enableCorsForAllOrigins()
        config.addStaticFiles(System.getenv(STATIC_FILE_FOLDER), Location.EXTERNAL)
    }.start(7000)
    hackSwaggerDoc(app)
    addErrorHandling(app, logger)
    val gson = getGson()
    fromJsonMapper = object : FromJsonMapper {
        override fun <T> map(json: String, targetClass: Class<T>): T = gson.fromJson(json, targetClass)
    }
    toJsonMapper = object : ToJsonMapper {
        override fun map(obj: Any): String = gson.toJson(obj)
    }

    addAuth(app, injector.getInstance<AuthService>().provider, injector.getInstance())
    createRoutes(app, injector)
}

fun createRoutes(app: Javalin, injector: Injector) {
    listOf(
            AuthControllerWrapper::class,
            AspectsControllerWrapper::class,
            UserControllerWrapper::class,
            GoalControllerWrapper::class,
            GratitudeControllerWrapper::class)
        .forEach {
            injector.getInstance(it.java).addRoutes(app)
        }
}
