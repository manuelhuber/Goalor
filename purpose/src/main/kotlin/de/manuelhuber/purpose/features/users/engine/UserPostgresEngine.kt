package de.manuelhuber.purpose.features.users.engine

import de.manuelhuber.purpose.features.users.models.Email
import de.manuelhuber.purpose.features.users.models.User
import de.manuelhuber.purpose.features.users.models.Username
import de.manuelhuber.purpose.lib.engine.Id
import de.manuelhuber.purpose.lib.exceptions.NotFound
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.statements.InsertStatement
import org.jetbrains.exposed.sql.statements.UpdateStatement
import org.jetbrains.exposed.sql.transactions.transaction

object Users : IntIdTable() {
    val email = varchar("email", 100)
    val username = varchar("username", 50).uniqueIndex()
    val firstName = varchar("first_name", 50)
    val lastName = varchar("last_name", 50)
    val password = varchar("password", 150)
}

class UserPostgresEngine() : UserEngine {

    override fun getByUsername(username: Username): User {
        return transaction {
            Users.select { Users.username eq username.value }
                .map(rowToUser).firstOrNull()
                    ?: throw NotFound(username.value, User::class, "username")
        }
    }

    override fun get(id: Id): User {
        return transaction {
            Users.select { Users.id eq id.value.toInt() }
                .map(rowToUser).firstOrNull()
                    ?: throw NotFound(id.value, User::class)
        }
    }

    override fun get(ids: List<Id>): List<User> {
        val intIds = ids.map { it.value.toInt() }
        return transaction { Users.select { Users.id inList intIds }.map(rowToUser) }
    }

    override fun create(model: User): User {
        val id = transaction { Users.insertAndGetId(insert(model)) }
        return model.copy(id = Id(id.toString()))
    }

    override fun update(id: Id, model: User): User {
        transaction { Users.update({ Users.id eq id.value.toInt() }, body = update(model)) }
        return model
    }

    override fun delete(id: Id): Boolean {
        return transaction { Users.deleteWhere { Users.id eq id.value.toInt() } == 1 }
    }
}

val rowToUser: (ResultRow) -> User = {
    User(id = Id(it[Users.id].toString()),
            email = Email(it[Users.email]),
            username = Username(it[Users.username]),
            firstName = it[Users.firstName],
            lastName = it[Users.lastName],
            password = it[Users.password]
    )
}

fun insert(model: User): Users.(InsertStatement<EntityID<Int>>) -> Unit = {
    it[email] = model.email.value
    it[username] = model.username.value
    it[firstName] = model.firstName
    it[lastName] = model.lastName
    it[password] = model.password
}

private fun update(model: User): Users.(UpdateStatement) -> Unit = {
    it[email] = model.email.value
    it[username] = model.username.value
    it[firstName] = model.firstName
    it[lastName] = model.lastName
    it[password] = model.password
}
