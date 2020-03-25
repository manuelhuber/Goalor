package de.manuelhuber.boyle

import com.google.gson.Gson
import com.google.gson.JsonSyntaxException
import com.rabbitmq.client.AMQP
import com.rabbitmq.client.ConnectionFactory
import com.rabbitmq.client.DefaultConsumer
import com.rabbitmq.client.Envelope
import com.sendgrid.*
import org.slf4j.LoggerFactory
import java.io.IOException


const val QUEUE_NAME = "reset_pw"
val logger = LoggerFactory.getLogger("Boyle")
val gson = Gson()

fun main() {
    val factory = ConnectionFactory()
    factory.host = "localhost"
    val connection = factory.newConnection()
    val channel = connection.createChannel()

    val consumer = object : DefaultConsumer(channel) {
        override fun handleDelivery(consumerTag: String,
                                    envelope: Envelope,
                                    properties: AMQP.BasicProperties,
                                    body: ByteArray) {
            val json = String(body, charset("UTF-8"))
            logger.info("Dequeued item with message='$json'")

            try {
                val job = gson.fromJson(json, PasswordResetJob::class.java)
                sendMail(job)
                channel.basicAck(envelope.deliveryTag, false)
                logger.info("Sent token ${job.token} to ${job.email}")
            } catch (exception: JsonSyntaxException) {
                // ¯\_(ツ)_/¯
                logger.info("Failed to parse payload $json")
                channel.basicAck(envelope.deliveryTag, false)
                return
            } catch (ex: IOException) {
                logger.error("Failed to send email.", ex)
                channel.basicNack(envelope.deliveryTag, false, true)
            }
        }
    }
    channel.basicConsume(QUEUE_NAME, false, consumer)
}

fun sendMail(job: PasswordResetJob) {
    val from = Email("test@example.com")
    val subject = "Password reset"
    val to = Email(job.email)
    val content = Content("text/plain", "http://167.71.132.37/reset/${job.username}/${job.token}")
    val mail = Mail(from, subject, to, content)

    val sg = SendGrid(System.getenv("send_grid_key"))
    val request = Request()
    request.method = Method.POST
    request.endpoint = "mail/send"
    request.body = mail.build()
    sg.api(request)
}

data class PasswordResetJob(val email: String, val token: String, val username: String)
