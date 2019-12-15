package features.users

import com.google.inject.Singleton
import features.users.models.User
import features.users.models.UserEngine
import lib.engine.NotFound

@Singleton
class LocalUserEngine : UserEngine {

    private val users = mutableMapOf<String, User>("0" to User("test",
            "\$2a\$10\$/UrUNRvydZ0rXWXN.cu5AuYgMJW8gMAcqmAQHuyc3BkJdmSNoNpf.", // "test"
            "0"))

    override fun getByEmail(email: String): User {
        return users.values.find { user -> user.email == email } ?: throw NotFound()
    }

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

