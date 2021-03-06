package de.manuelhuber.purpose.app

import com.google.inject.name.Names
import de.manuelhuber.purpose.features.aspects.engine.AspectsEngine
import de.manuelhuber.purpose.features.aspects.engine.AspectsPostgresEngine
import de.manuelhuber.purpose.features.goals.engine.GoalPostgresEngine
import de.manuelhuber.purpose.features.goals.engine.GoalsEngine
import de.manuelhuber.purpose.features.habits.engine.HabitEngine
import de.manuelhuber.purpose.features.habits.engine.HabitPostgresEngine
import de.manuelhuber.purpose.features.habits.engine.HabitValueEngine
import de.manuelhuber.purpose.features.habits.engine.HabitValuePostgresEngine
import de.manuelhuber.purpose.features.users.engine.UserEngine
import de.manuelhuber.purpose.features.users.engine.UserPostgresEngine
import dev.misfitlabs.kotlinguice4.KotlinModule

const val JWT_SECRET = "jwt_secret"
const val DB_URL = "database_url"
const val DB_USER = "database_user"
const val DB_PASSWORD = "database_password"
const val STATIC_FILE_FOLDER = "static_folder"
const val QUEUE_HOST = "queue_host"

class GuiceModule : KotlinModule() {
    override fun configure() {

        // System Envs
        bindConstant().annotatedWith(Names.named(JWT_SECRET))
            .to(System.getenv(JWT_SECRET)
                    ?: throw Exception("No secret '$JWT_SECRET' found in environment - this is needed to use JWT"))
        bindConstant().annotatedWith(Names.named(DB_URL)).to(System.getenv(DB_URL))
        bindConstant().annotatedWith(Names.named(DB_PASSWORD)).to(System.getenv(DB_PASSWORD))
        bindConstant().annotatedWith(Names.named(DB_USER)).to(System.getenv(DB_USER))
        bindConstant().annotatedWith(Names.named(STATIC_FILE_FOLDER)).to(System.getenv(STATIC_FILE_FOLDER))
        bindConstant().annotatedWith(Names.named(QUEUE_HOST)).to(System.getenv(QUEUE_HOST))

        // Engines
        bind<UserEngine>().to<UserPostgresEngine>()
        bind<AspectsEngine>().to<AspectsPostgresEngine>()
        bind<GoalsEngine>().to<GoalPostgresEngine>()
        bind<HabitEngine>().to<HabitPostgresEngine>()
        bind<HabitValueEngine>().to<HabitValuePostgresEngine>()
    }
}

