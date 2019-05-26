/* eslint-disable camelcase */
import Joi from 'joi'

/**
 * @description Get name validation schema
 *
 * @param {string} label the text to use instead of field name in the error message;

 * @returns {string} Instance of JOI validation schema
 * @method getNameSchema
 */

const shipping_id = Joi.number().integer()
  .min(1)
  .label('shipping_id')

const tax_id = Joi.number().integer()
  .min(1)
  .label('tax_id')

const cart_id = Joi.number().integer()
  .min(1)
  .label('cart_id')
export const createOrderSchema = Joi.object().keys({
  shipping_id,
  tax_id,
  cart_id
})
