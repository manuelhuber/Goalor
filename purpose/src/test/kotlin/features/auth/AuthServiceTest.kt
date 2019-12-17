package features.auth

import features.auth.models.WrongPassword
import features.users.models.User
import features.users.models.UserEngine
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.function.Executable
import org.mockito.Mockito

class AuthServiceTest {
    lateinit var service: AuthService
    lateinit var engineMock: UserEngine
    private val password = "foobar"

    @BeforeEach
    internal fun setUp() {
        engineMock = Mockito.mock(UserEngine::class.java)
        service = AuthService(engineMock, "secret")
    }

    @Test
    fun token() {
        val hash = service.hashPassword(password)
        val user = User(email = "mail", username = "user", lastName = "", firstName = "", id = "my ID", password = hash)
        Mockito.`when`(engineMock.getByEmail("mail")).thenReturn(user)
        val token = service.login("mail", password)
        assertTrue(token.isNotEmpty())
        assertThrows(WrongPassword::class.java, Executable { service.login("mail", "wrong password") })
        val validateToken = service.provider.validateToken(token)
        assertTrue(validateToken.isPresent)
        assertEquals(validateToken.get().claims[Claims.ID.name]?.asString(), "my ID")

    }
}
