package app

import com.google.inject.name.Names
import dev.misfitlabs.kotlinguice4.KotlinModule
import features.auth.JWT_SECRET
import features.users.LocalUserEngine
import features.users.models.UserEngine

class GuiceModule : KotlinModule() {
    override fun configure() {
        bindConstant().annotatedWith(Names.named(JWT_SECRET))
            .to(System.getenv(JWT_SECRET)
                    ?: throw Exception("No secret found in environment - this is needed to use JWT"))
        bind<UserEngine>().to<LocalUserEngine>()
    }
}
