package de.manuelhuber.purpose.features.users.models

import de.manuelhuber.annotations.MinLength

data class PasswordUpdate(val old: String?,
                          val token: String?,
                          @MinLength(5)
                          val pw: String)
