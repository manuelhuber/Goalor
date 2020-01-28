package de.manuelhuber.purpose.lib.rabbitmq

import com.rabbitmq.client.BuiltinExchangeType
import com.rabbitmq.client.Connection
import com.rabbitmq.client.ConnectionFactory
import de.manuelhuber.purpose.app.QUEUE_HOST
import javax.inject.Inject
import javax.inject.Named

class RabbitMQConnector @Inject constructor(@Named(QUEUE_HOST) val host: String) {
    private val factory = ConnectionFactory()
    private val connection: Connection
    private val exchangeName = "purpose"

    init {
        factory.host = host
        connection = factory.newConnection()
    }

    fun getConnection(queue: String): (String) -> Unit {
        val channel = connection.createChannel()
        channel.exchangeDeclare(exchangeName, BuiltinExchangeType.DIRECT, true);
        channel.queueDeclare(queue, true, false, false, null)
        channel.queueBind(queue, exchangeName, queue)
        return { message: String ->
            channel.basicPublish(exchangeName, queue, null, message.toByteArray())
        }
    }


}
