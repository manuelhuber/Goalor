package de.manuelhuber.purpose.app

import com.google.inject.Inject
import com.google.inject.name.Named
import de.manuelhuber.purpose.features.aspects.engine.Aspects
import de.manuelhuber.purpose.features.goals.engine.GoalRelations
import de.manuelhuber.purpose.features.goals.engine.Goals
import de.manuelhuber.purpose.features.gratitude.engine.Gratitudes
import de.manuelhuber.purpose.features.habits.engine.HabitValues
import de.manuelhuber.purpose.features.habits.engine.Habits
import de.manuelhuber.purpose.features.users.engine.Users
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction


class DatabaseInitiator @Inject constructor(@Named(DB_URL) val url: String,
                                            @Named(DB_USER) val user: String,
                                            @Named(DB_PASSWORD) val password: String) {
    val db: Database = Database.connect(url, driver = "org.postgresql.Driver", user = user, password = password)

    fun init() {
//        val loader = Thread.currentThread().contextClassLoader
//        val url: URL = loader.getResource("db/goals")
//        val path: String = url.getPath()
//        File(path).listFiles().forEach {
//            print(BufferedReader(FileReader(it.canonicalFile)).readText())
//        }
        listOf(Users, Aspects, Goals, GoalRelations, Gratitudes, Habits, HabitValues).forEach {
            transaction { SchemaUtils.createMissingTablesAndColumns(it) }
        }
    }
}
