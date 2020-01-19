package de.manuelhuber.purpose.app

import com.google.inject.name.Names
import de.manuelhuber.purpose.features.aspects.engine.AspectsEngine
import de.manuelhuber.purpose.features.aspects.engine.AspectsPostgresEngine
import de.manuelhuber.purpose.features.auth.JWT_SECRET
import de.manuelhuber.purpose.features.goals.engine.GoalPostgresEngine
import de.manuelhuber.purpose.features.goals.engine.GoalsEngine
import de.manuelhuber.purpose.features.users.engine.UserEngine
import de.manuelhuber.purpose.features.users.engine.UserPostgresEngine
import dev.misfitlabs.kotlinguice4.KotlinModule

class GuiceModule : KotlinModule() {
    override fun configure() {
        bindConstant().annotatedWith(Names.named(JWT_SECRET))
            .to(System.getenv(JWT_SECRET)
                    ?: throw Exception("No secret '$JWT_SECRET' found in environment - this is needed to use JWT"))
        bindConstant().annotatedWith(Names.named(DB_URL)).to(System.getenv(DB_URL))
        bindConstant().annotatedWith(Names.named(DB_PASSWORD)).to(System.getenv(DB_PASSWORD))
        bindConstant().annotatedWith(Names.named(DB_USER)).to(System.getenv(DB_USER))
        bindConstant().annotatedWith(Names.named(STATIC_FILE_FOLDER)).to(System.getenv(STATIC_FILE_FOLDER))
        bind<UserEngine>().to<UserPostgresEngine>()
        bind<AspectsEngine>().to<AspectsPostgresEngine>()
        bind<GoalsEngine>().to<GoalPostgresEngine>()
    }
}
