package de.manuelhuber.purpose.features.goals.engine

import de.manuelhuber.purpose.features.aspects.engine.Aspects
import de.manuelhuber.purpose.features.users.engine.Users
import org.jetbrains.exposed.dao.id.UUIDTable
import org.jetbrains.exposed.sql.ReferenceOption
import org.jetbrains.exposed.sql.Table

object Goals : UUIDTable() {
    val ownerId = uuid("owner_id").references(Users.id, onDelete = ReferenceOption.RESTRICT).index()
    val title = varchar("title", 100)
    val aspectId = uuid("aspect_id").references(Aspects.id, onDelete = ReferenceOption.SET_NULL).nullable()
    val done = bool("done")
    val image = varchar("image", 250).nullable()
    val description = text("description").nullable()
}

object GoalRelations : Table() {
    val parent = uuid("parent_id").references(Goals.id, onDelete = ReferenceOption.CASCADE).index()
    val child = uuid("child_id").references(Goals.id, onDelete = ReferenceOption.CASCADE).index()
    override val primaryKey = PrimaryKey(parent, child, name = "GoalRelationPK")
}

