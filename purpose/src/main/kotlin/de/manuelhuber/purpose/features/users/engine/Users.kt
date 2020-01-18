package de.manuelhuber.purpose.features.users.engine

import org.jetbrains.exposed.dao.id.IntIdTable

object Users : IntIdTable() {
    val email = varchar("email", 100)
    val username = varchar("username", 50).uniqueIndex()
    val firstName = varchar("first_name", 50)
    val lastName = varchar("last_name", 50)
    val password = varchar("password", 150)
}
