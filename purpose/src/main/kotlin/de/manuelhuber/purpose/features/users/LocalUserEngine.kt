package de.manuelhuber.purpose.features.users

import com.google.inject.Singleton
import de.manuelhuber.purpose.features.users.models.User
import de.manuelhuber.purpose.features.users.models.UserEngine
import de.manuelhuber.purpose.lib.engine.NotFound

@Singleton
class LocalUserEngine : UserEngine {

    private val users = mutableMapOf("0" to User(email = "mail@mail.mail",
            username = "test",
            password = "\$2a\$10\$/UrUNRvydZ0rXWXN.cu5AuYgMJW8gMAcqmAQHuyc3BkJdmSNoNpf.", // "test"
            id = "0",
            firstName = "First",
            lastName = "Last"))

    override fun getByUsername(username: String): User {
        return users.values.find { user -> user.username == username } ?: throw NotFound(username,
                User::class,
                "username")
    }

    override fun get(id: String): User {
        return users.getOrElse(id) { throw NotFound(id, User::class) }
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

