package de.manuelhuber.purpose.lib.controller

import de.manuelhuber.purpose.features.auth.models.InvalidToken
import de.manuelhuber.purpose.features.auth.Claims
import io.javalin.http.Context

fun Context.getId(): String {
    return attribute<String>(Claims.ID.name) ?: throw InvalidToken()
}

fun Context.getIdNoThrow(): String? {
    return this.attribute<String>(Claims.ID.name)!!
}
