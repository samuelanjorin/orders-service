import redis from 'redis'
import dotenv from 'dotenv'
dotenv.config()

let redisConfig = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || '',
  db: process.env.REDIS_DB || 'turing'
}
export default redis.createClient(redisConfig.port, redisConfig.host)
