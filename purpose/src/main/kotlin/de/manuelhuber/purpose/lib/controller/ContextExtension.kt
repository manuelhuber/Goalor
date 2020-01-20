package de.manuelhuber.purpose.lib.controller

import de.manuelhuber.purpose.features.auth.Claims
import de.manuelhuber.purpose.features.auth.models.InvalidToken
import de.manuelhuber.purpose.lib.engine.Id
import io.javalin.http.Context

fun Context.getId(): Id {
    return Id(attribute<String>(Claims.ID.name) ?: throw InvalidToken())
}
