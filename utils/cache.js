import redis from '../config/redis'
import constants from '../constants/index'
import logger from './errors/errorlogger'

redis.on('connect', function () {
  logger.info('Redis client connected')
})
redis.on('error', function (err) {
  logger.error('Something went wrong ' + err)
})

function checkCache (key) {
  return new Promise((resolve, reject) => {
    redis.get(key, function (error, result) {
      if (error) {
        return null
      }
      if (result) {
        resolve(JSON.parse(result))
      } else {
        resolve(null)
      }
    })
  })
}

function addToCache (key, data, type) {
  if (type === constants.CACHE_TYPES.hour) {
    redis.setex(key, constants.CACHE_HOUR.one, JSON.stringify(data))
  }
  if (type === constants.CACHE_TYPES.day) {
    redis.setex(key, constants.CACHE_HOUR.twenty_four, JSON.stringify(data))
  }
}
export default { checkCache, addToCache }
