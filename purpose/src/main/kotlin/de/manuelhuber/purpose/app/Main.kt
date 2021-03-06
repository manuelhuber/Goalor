package de.manuelhuber.purpose.app

import com.google.inject.Guice
import com.google.inject.Injector
import de.manuelhuber.purpose.features.aspects.AspectsControllerWrapper
import de.manuelhuber.purpose.features.auth.AuthControllerWrapper
import de.manuelhuber.purpose.features.auth.AuthService
import de.manuelhuber.purpose.features.auth.JWTAccessManager
import de.manuelhuber.purpose.features.auth.addAuth
import de.manuelhuber.purpose.features.goals.GoalControllerWrapper
import de.manuelhuber.purpose.features.gratitude.GratitudeControllerWrapper
import de.manuelhuber.purpose.features.habits.HabitControllerWrapper
import de.manuelhuber.purpose.features.users.UserControllerWrapper
import de.manuelhuber.purpose.features.users.UserService
import dev.misfitlabs.kotlinguice4.getInstance
import io.javalin.Javalin
import io.javalin.core.validation.JavalinValidation
import io.javalin.http.staticfiles.Location
import io.javalin.plugin.json.FromJsonMapper
import io.javalin.plugin.json.JavalinJson.fromJsonMapper
import io.javalin.plugin.json.JavalinJson.toJsonMapper
import io.javalin.plugin.json.ToJsonMapper
import org.slf4j.LoggerFactory
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.*

private val logger: org.slf4j.Logger = LoggerFactory.getLogger(Javalin::class.java)

const val DEV_MODE = "dev"

fun main() {
    val injector = Guice.createInjector(GuiceModule())
    // Init DB
    injector.getInstance<DatabaseInitiator>().init()

    val userService = injector.getInstance<UserService>()

    val app = Javalin.create { config ->
        addSwagger(config)
        config.accessManager(JWTAccessManager(userService))
        config.enableCorsForAllOrigins()
        config.addStaticFiles(System.getenv(STATIC_FILE_FOLDER), Location.EXTERNAL)
        if (System.getenv(DEV_MODE) != null) {
            config.enableDevLogging()
        }
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
    JavalinValidation.register(LocalDate::class.java) {
        try {
            LocalDate.parse(it, DateTimeFormatter.ISO_LOCAL_DATE)
        } catch (e: Exception) {
            Instant.ofEpochMilli(Date.parse(it)).atZone(ZoneId.systemDefault()).toLocalDate()
        }
    }

    addAuth(app, injector.getInstance<AuthService>().provider, userService)
    createRoutes(app, injector)
}

fun createRoutes(app: Javalin, injector: Injector) {
    listOf(AuthControllerWrapper::class,
            AspectsControllerWrapper::class,
            UserControllerWrapper::class,
            HabitControllerWrapper::class,
            GoalControllerWrapper::class,
            GratitudeControllerWrapper::class).forEach {
        injector.getInstance(it.java)
            .addRoutes(app)
    }
}
