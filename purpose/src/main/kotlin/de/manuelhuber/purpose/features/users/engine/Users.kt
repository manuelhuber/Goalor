package de.manuelhuber.purpose.features.users.engine

import org.jetbrains.exposed.dao.id.UUIDTable
import org.jetbrains.exposed.sql.`java-time`.datetime

object Users : UUIDTable() {
    val email = varchar("email", 100)
    val username = varchar("username", 50).uniqueIndex()
    val firstName = varchar("first_name", 50)
    val lastName = varchar("last_name", 50)
    val password = varchar("password", 150)
    val logout = datetime("logout").nullable()
}
