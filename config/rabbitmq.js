import { Connection }  from 'amqplib-as-promised'
import envconfig from './envconfig'


dotenv.config()
/**
   * @description connects to RabbitMQ
   *
   * @param {string} queueName
   * @param {string} message
   *
   *
   */
 async function connect (
   notificationType,
   to,
   from,
   subject, 
   text,
   html) {
  
 const msg = {
  notification_type: notificationType,
  payload:{
    to: 'samelikzra@gmail.com',
    from: 'samelikzra@gmail.com',
    subject: 'TEXT',
    text: 'FROM CODE',
    html: '<strong>We are fine</strong>',
  }
  
}
const connection = new Connection(envconfig.rabbitMQURL)
await connection.init()
const channel = await connection.createChannel()
await channel.assertQueue(envconfig.queueName)
await channel.sendToQueue(envconfig.queueName, Buffer.from(JSON.stringify(msg)))

return channel
}
  
  
module.exports = connect

