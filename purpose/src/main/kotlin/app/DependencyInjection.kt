package app

import dev.misfitlabs.kotlinguice4.KotlinModule
import features.users.LocalUserEngine
import features.users.models.UserEngine

class MyModule : KotlinModule() {
    override fun configure() {
        bind<UserEngine>().to<LocalUserEngine>()
    }
}
