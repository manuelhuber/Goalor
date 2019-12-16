package features.users.models

data class UserTO(val email: String, val id: String) {
    companion object {
        fun fromUser(user: User): UserTO {
            return UserTO(user.email, user.id)
        }
    }
}
