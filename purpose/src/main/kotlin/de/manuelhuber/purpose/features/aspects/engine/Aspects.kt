package de.manuelhuber.purpose.features.aspects.engine

import de.manuelhuber.purpose.features.users.engine.Users
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.ReferenceOption

object Aspects : IntIdTable() {
    val name = varchar("name", 100)
    val weight = integer("weight")
    val color = varchar("color", 50)
    val completed = integer("completed")
    val owner = integer("owner_id").references(Users.id, onDelete = ReferenceOption.CASCADE).index()
}
