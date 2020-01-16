package de.manuelhuber.purpose.app

import com.google.inject.Inject
import com.google.inject.name.Named
import de.manuelhuber.purpose.features.users.engine.Users
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import java.io.BufferedReader
import java.io.File
import java.io.FileReader
import java.net.URL


const val DB_URL = "database_url"
const val DB_USER = "database_user"
const val DB_PASSWORD = "database_password"

object TableVersions : Table() {
    val name: Column<String> = varchar("name", 200)
    val version: Column<Int> = integer("version")
}

class DatabaseInitiator @Inject constructor(@Named(DB_URL) val url: String,
                                            @Named(DB_USER) val user: String,
                                            @Named(DB_PASSWORD) val password: String) {
    val db: Database = Database.connect(url, driver = "org.postgresql.Driver", user = user, password = password)

    fun init() {
        val versions = mutableMapOf<String, Int>()
        transaction {
            SchemaUtils.createMissingTablesAndColumns(TableVersions)
            for (entry in TableVersions.selectAll()) {
                versions[entry[TableVersions.name]] = entry[TableVersions.version]
            }
        }
        val loader = Thread.currentThread().contextClassLoader
        val url: URL = loader.getResource("db/goals")
        val path: String = url.getPath()
        File(path).listFiles().forEach {
            print(BufferedReader(FileReader(it.canonicalFile)).readText())
        }
        listOf(Users).forEach {
            transaction { SchemaUtils.createMissingTablesAndColumns(it) }
        }
    }
}
