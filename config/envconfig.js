import dotenv from 'dotenv'

dotenv.config()
const {
  CLIENT_SECRET,
  DIALECT,
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  TEST_DIALECT,
  TEST_DATABASE_HOST,
  TEST_DATABASE_NAME,
  TEST_DATABASE_PASSWORD,
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
  TAX_URL,
  SHIPPING_URL,
  SHOPPING_CART_URL,
  AMQP_URL,
  QUEUE_NAME
} = process.env

export default {
  database: {
    name: DATABASE_NAME,
    username: DATABASE_USERNAME,
    host: DATABASE_HOST,
    password: DATABASE_PASSWORD,
    dialect: DIALECT
  },

  unitTestDatabase: {
    dbName: TEST_DATABASE_NAME,
    host: TEST_DATABASE_HOST,
    password: TEST_DATABASE_PASSWORD,
    dialect: TEST_DIALECT
  },
  appSecret: CLIENT_SECRET,

  redis: {
    host: REDIS_HOST || '127.0.0.1',
    password: REDIS_PASSWORD || '',
    port: REDIS_PORT || 6379

  },
  taxUrl: TAX_URL,
  shippingUrl: SHIPPING_URL,
  shoppingCartUrl: SHOPPING_CART_URL,
  rabbitMQURL: AMQP_URL,
  queueName: QUEUE_NAME


}
