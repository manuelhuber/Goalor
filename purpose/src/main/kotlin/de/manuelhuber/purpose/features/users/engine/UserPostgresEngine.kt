package de.manuelhuber.purpose.features.users.engine

import de.manuelhuber.purpose.app.DatabaseInitiator
import de.manuelhuber.purpose.features.users.models.Email
import de.manuelhuber.purpose.features.users.models.User
import de.manuelhuber.purpose.features.users.models.Username
import de.manuelhuber.purpose.lib.engine.Id
import de.manuelhuber.purpose.lib.engine.toUUID
import de.manuelhuber.purpose.lib.exceptions.NotFound
import de.manuelhuber.purpose.lib.exceptions.ValidationError
import org.jetbrains.exposed.exceptions.ExposedSQLException
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.statements.UpdateBuilder
import org.jetbrains.exposed.sql.transactions.transaction
import org.postgresql.util.PSQLException
import javax.inject.Inject

class UserPostgresEngine @Inject constructor(private val db: DatabaseInitiator) : UserEngine {

    override fun getByUsername(username: Username): User {
        return transaction(db.db) {
            Users.select { Users.username eq username.value }.map(rowToUser).firstOrNull()
                    ?: throw NotFound(username.value, User::class, "username")
        }
    }

    override fun get(id: Id): User {
        return transaction(db.db) {
            Users.select { Users.id eq id.toUUID() }.map(rowToUser).firstOrNull() ?: throw NotFound(id.value,
                                                                                                    User::class)
        }
    }

    override fun get(ids: List<Id>): List<User> {
        val intIds = ids.map { it.toUUID() }
        return transaction(db.db) {
            Users.select { Users.id inList intIds }
                .map(rowToUser)
        }
    }

    override fun create(model: User): User {
        try {
            val id = transaction(db.db) { Users.insertAndGetId(fillRows(model)) }
            return model.copy(id = Id(id.toString()))
        } catch (e: ExposedSQLException) {
            throw ValidationError((e.cause as PSQLException).serverErrorMessage.detail)
        }
    }

    override fun update(id: Id, model: User): User {
        try {
            transaction(db.db) { Users.update({ Users.id eq id.toUUID() }, body = fillRows(model)) }
            return model.copy()
        } catch (e: ExposedSQLException) {
            throw ValidationError((e.cause as PSQLException).serverErrorMessage.detail)
        }
    }

    override fun delete(id: Id): Boolean {
        return transaction(db.db) { Users.deleteWhere { Users.id eq id.toUUID() } == 1 }
    }
}

val rowToUser: (ResultRow) -> User = {
    User(id = Id(it[Users.id].toString()),
         username = Username(it[Users.username]),
         email = Email(it[Users.email]),
         firstName = it[Users.firstName],
         lastName = it[Users.lastName],
         password = it[Users.password],
         logout = it[Users.logout],
         resetToken = it[Users.resetToken])
}

private fun fillRows(model: User): Users.(UpdateBuilder<Int>) -> Unit = {
    it[email] = model.email.value
    it[username] = model.username.value
    it[firstName] = model.firstName
    it[lastName] = model.lastName
    it[password] = model.password
    it[logout] = model.logout
    it[resetToken] = model.resetToken
}
