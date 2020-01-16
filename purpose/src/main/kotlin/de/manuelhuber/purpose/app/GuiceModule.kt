package de.manuelhuber.purpose.app

import com.google.inject.name.Names
import de.manuelhuber.purpose.features.aspects.AspectsEngineLocal
import de.manuelhuber.purpose.features.aspects.model.AspectsEngine
import de.manuelhuber.purpose.features.auth.JWT_SECRET
import de.manuelhuber.purpose.features.goals.engine.GoalsEngine
import de.manuelhuber.purpose.features.goals.engine.GoalsEngineLocal
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
        bind<UserEngine>().to<UserPostgresEngine>()
        bind<AspectsEngine>().to<AspectsEngineLocal>()
        bind<GoalsEngine>().to<GoalsEngineLocal>()
    }
}
