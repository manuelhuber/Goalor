package features.users

import features.users.models.User
import features.users.models.UserEngine
import lib.engine.NotFound

class LocalUserEngine : UserEngine {

    private val users = mutableMapOf<String, User>()

    override fun get(id: String): User {
        return users.getOrElse(id) { throw NotFound() }
    }

    override fun create(update: User): User {
        val user = update.copy(id = users.count().toString())
        users[user.id] = user
        return user
    }

    override fun update(id: String, model: User): User {
        users[id] = model
        return model
    }

}

