package de.manuelhuber.boyle

import com.rabbitmq.client.AMQP
import com.rabbitmq.client.ConnectionFactory
import com.rabbitmq.client.DefaultConsumer
import com.rabbitmq.client.Envelope
import com.sendgrid.*
import java.io.IOException


const val QUEUE_NAME = "reset_pw"

fun main() {
    val factory = ConnectionFactory()
    factory.host = "localhost"
    val connection = factory.newConnection()
    val channel = connection.createChannel()

    println(" [*] Waiting for messages. To exit press CTRL+C")

    val consumer = object : DefaultConsumer(channel) {
        override fun handleDelivery(consumerTag: String,
                                    envelope: Envelope,
                                    properties: AMQP.BasicProperties,
                                    body: ByteArray) {
            val message = String(body, charset("UTF-8"))
            println(" [x] Received '$message'")

            val (email, token) = message.split(":")
            sendMail(email, token)
            println(" [x] Sent token $token to $email")

        }
    }
    channel.basicConsume(QUEUE_NAME, true, consumer)
}

fun sendMail(userEmail: String, token: String) {
    val from = Email("test@example.com")
    val subject = "Password reset"
    val to = Email(userEmail)
    val content = Content("text/plain", "http://localhost:3000/reset/$token")
    val mail = Mail(from, subject, to, content)

    val sg = SendGrid(System.getenv("send_grid_key"))
    val request = Request()
    try {
        request.method = Method.POST
        request.endpoint = "mail/send"
        request.body = mail.build()
        val response = sg.api(request)
    } catch (ex: IOException) {
        throw ex
    }
}

fun mailBody(token: String): String {
    return ""
}
