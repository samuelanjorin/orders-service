import validator from '../validations/validator'
import constants from '../constants'
import {
  createOrderSchema
} from '../validations/schemas/schema'

/**
 * @description Get the schema definitions
 *
 * @param {object} req the request object
 * @returns {Joi.object} a Joi object
 */
const getSchema = req => {
  const schemas = {
    '/': createOrderSchema
  }
  let arrayValue = req.originalUrl.split('/')
  let arraylength = arrayValue.length - 1
  return schemas[`/${arrayValue[arraylength]}`]
}

/**
 * Validate input
 *
 * @param {object} req HTTP request object
 * @param {object} res HTTP response object
 * @param {function} next callback
 * @returns {funcion} HTTP response
 */
export default async (req, res, next) => {
  const validation = await validator(req.body, getSchema(req))

  if (validation.hasError) {
    return res.status(constants.NETWORK_CODES.HTTP_BAD_REQUEST).json(
      validation.error
    )
  }
  req.body = validation.fields
  return next()
}
