package de.manuelhuber.purpose.features.auth

import de.manuelhuber.purpose.features.auth.models.WrongPassword
import de.manuelhuber.purpose.features.testUser
import de.manuelhuber.purpose.features.users.engine.UserEngine
import de.manuelhuber.purpose.features.users.models.Username
import de.manuelhuber.purpose.lib.rabbitmq.RabbitMQConnector
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mockito

class AuthServiceTest {
    private lateinit var service: AuthService
    private lateinit var engineMock: UserEngine
    private val password = "foobar"

    @BeforeEach
    internal fun setUp() {
        engineMock = Mockito.mock(UserEngine::class.java)
        val connector = Mockito.mock(RabbitMQConnector::class.java)
        service = AuthService(engineMock, "secret", connector)
    }

    @Test
    fun token() {
        val hash = service.hashPassword(password)
        val user = testUser(password = hash)
        Mockito.`when`(engineMock.getByUsername(Username("user")))
            .thenReturn(user)
        val token = service.login(Username("user"), password)
        assertTrue(token.isNotEmpty())
        assertThrows(WrongPassword::class.java) { service.login(Username("user"), "wrong password") }
        val validateToken = service.provider.validateToken(token)
        assertTrue(validateToken.isPresent)
        assertEquals(validateToken.get().claims[Claims.ID.name]?.asString(), "0")

    }
}
