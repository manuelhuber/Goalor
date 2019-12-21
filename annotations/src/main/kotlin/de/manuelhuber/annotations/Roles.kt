package de.manuelhuber.annotations

import io.javalin.core.security.Role

enum class Roles : Role {
    ANYONE, USER,
}
