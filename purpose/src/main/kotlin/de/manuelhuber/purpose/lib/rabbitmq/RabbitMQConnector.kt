package de.manuelhuber.purpose.lib.rabbitmq

import com.rabbitmq.client.BuiltinExchangeType
import com.rabbitmq.client.Connection
import com.rabbitmq.client.ConnectionFactory
import de.manuelhuber.purpose.app.QUEUE_HOST
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.io.IOException
import javax.inject.Inject
import javax.inject.Named


class RabbitMQConnector @Inject constructor(@Named(QUEUE_HOST) val host: String) {
    private val factory = ConnectionFactory()
    private val connection: Connection
    private val exchangeName = "purpose"
    private val logger: Logger;

    init {
        factory.host = host
        connection = factory.newConnection()
        logger = LoggerFactory.getLogger(RabbitMQConnector::class.java)
    }

    fun getConnection(queue: String): (String) -> Unit {
        val channel = connection.createChannel()
        channel.exchangeDeclare(exchangeName, BuiltinExchangeType.DIRECT, true);
        channel.queueDeclare(queue, true, false, false, null)
        channel.queueBind(queue, exchangeName, queue)
        return { message: String ->
            logger.info("Sending to queue='$queue' mesage='$message'")
            try {
                channel.basicPublish(exchangeName, queue, null, message.toByteArray())
            } catch (e: IOException) {
                logger.error("Failed to enqueue into queue='$queue' message='$message'. Exception:", e)
            }
            logger.info("Success: Sending to queue='$queue' mesage='$message'")
        }
    }
}
