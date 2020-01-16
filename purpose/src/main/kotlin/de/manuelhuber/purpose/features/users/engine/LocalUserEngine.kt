package de.manuelhuber.purpose.features.users.engine

import com.google.inject.Singleton
import de.manuelhuber.purpose.features.users.models.Email
import de.manuelhuber.purpose.features.users.models.User
import de.manuelhuber.purpose.features.users.models.Username
import de.manuelhuber.purpose.lib.engine.Id
import de.manuelhuber.purpose.lib.exceptions.NotFound

@Singleton
class LocalUserEngine : UserEngine {

    private val users = mutableMapOf(Id("0") to User(email = Email("mail@mail.mail"),
            username = Username("test"),
            password = "\$2a\$10\$/UrUNRvydZ0rXWXN.cu5AuYgMJW8gMAcqmAQHuyc3BkJdmSNoNpf.", // "test"
            id = Id("0"),
            firstName = "First",
            lastName = "Last"))

    override fun getByUsername(username: Username): User {
        return users.values.find { user -> user.username == username } ?: throw NotFound(
                username.value,
                User::class,
                "username")
    }

    override fun get(id: Id): User {
        return users.getOrElse(id) {
            throw NotFound(id.value,
                    User::class)
        }
    }

    override fun get(ids: List<Id>): List<User> {
        return ids.map(::get)
    }

    override fun create(model: User): User {
        val user = model.copy(id = Id(users.count().toString()))
        users[user.id] = user
        return user
    }

    override fun update(id: Id, model: User): User {
        users[id] = model
        return model
    }

    override fun delete(id: Id): Boolean {
        return users.remove(id) != null
    }

}

