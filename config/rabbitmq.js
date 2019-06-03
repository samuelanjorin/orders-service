import { Connection } from 'amqplib-as-promised'
import envconfig from './envconfig'

export default async function connect (msg) {
  const connection = new Connection(envconfig.rabbitMQURL)
  await connection.init()
  const channel = await connection.createChannel()
  await channel.assertQueue(envconfig.queueName)
  await channel.sendToQueue(envconfig.queueName, Buffer.from(JSON.stringify(msg)))

  return channel
}
