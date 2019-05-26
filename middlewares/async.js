
/**
 * @description handles try catch errors for all routes
 *
 * @param {function} handler
 *
 */

export default function asyncF (handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res)
    } catch (error) {
      next(error)
    }
  }
}
