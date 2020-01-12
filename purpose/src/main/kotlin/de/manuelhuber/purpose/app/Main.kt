package de.manuelhuber.purpose.app

import com.google.gson.GsonBuilder
import com.google.inject.Guice
import com.google.inject.Injector
import de.manuelhuber.purpose.features.aspects.AspectsControllerWrapper
import de.manuelhuber.purpose.features.auth.AuthControllerWrapper
import de.manuelhuber.purpose.features.auth.AuthService
import de.manuelhuber.purpose.features.auth.MyAccessManager
import de.manuelhuber.purpose.features.auth.addAuth
import de.manuelhuber.purpose.features.goals.GoalControllerWrapper
import de.manuelhuber.purpose.features.users.UserControllerWrapper
import dev.misfitlabs.kotlinguice4.getInstance
import io.javalin.Javalin
import io.javalin.plugin.json.FromJsonMapper
import io.javalin.plugin.json.JavalinJson.fromJsonMapper
import io.javalin.plugin.json.JavalinJson.toJsonMapper
import io.javalin.plugin.json.ToJsonMapper
import org.slf4j.LoggerFactory

private val logger: org.slf4j.Logger = LoggerFactory.getLogger(Javalin::class.java)

fun main() {
    val app = Javalin.create { config ->
        addSwagger(config)
        config.accessManager(MyAccessManager())
        config.enableCorsForAllOrigins()
        config.enableDevLogging()
    }.start(7000)
    hackSwaggerDoc(app)
    addErrorHandling(app, logger)

    val gson = GsonBuilder().create()
    fromJsonMapper = object : FromJsonMapper {
        override fun <T> map(json: String, targetClass: Class<T>): T = gson.fromJson(json, targetClass)
    }
    toJsonMapper = object : ToJsonMapper {
        override fun map(obj: Any): String = gson.toJson(obj)
    }

    val injector = Guice.createInjector(GuiceModule())
    addAuth(app, injector.getInstance<AuthService>().provider, injector.getInstance())
    createRoutes(app, injector)
}

fun createRoutes(app: Javalin, injector: Injector) {
    val controllers = listOf(AuthControllerWrapper::class,
            AspectsControllerWrapper::class,
            UserControllerWrapper::class,
            GoalControllerWrapper::class);
    controllers.forEach { kClass ->
        val instance = injector.getInstance(kClass.java)
        instance.addRoutes(app)
    }
}
