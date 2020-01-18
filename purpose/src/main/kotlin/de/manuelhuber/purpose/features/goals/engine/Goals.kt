package de.manuelhuber.purpose.features.goals.engine

import de.manuelhuber.purpose.features.aspects.engine.Aspects
import de.manuelhuber.purpose.features.users.engine.Users
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.ReferenceOption
import org.jetbrains.exposed.sql.Table

object Goals : IntIdTable() {
    val ownerId = integer("owner_id").references(Users.id, onDelete = ReferenceOption.RESTRICT).index()
    val title = varchar("title", 100)
    val aspectId = integer("aspect_id").references(Aspects.id, onDelete = ReferenceOption.SET_NULL).nullable()
    val done = bool("done")
    val image = varchar("image", 250).nullable()
    val description = text("description").nullable()
}

object GoalRelations : Table() {
    val parent = integer("parent_id").references(Goals.id, onDelete = ReferenceOption.CASCADE).index()
    val child = integer("child_id").references(Goals.id, onDelete = ReferenceOption.CASCADE).index()
    override val primaryKey = PrimaryKey(parent, child, name = "GoalRelationPK")
}

