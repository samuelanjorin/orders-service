import Joi from 'joi'
import constants from '../constants'
import globalfunc from '../utils/globalfunc'

/**
 * @description Validate User Input
 *
 * @param {object} inputData
 * @param {object} schema
 * @returns {object} true if no error | array of errors
 */

export default async (inputData, schema) => {
  try {
    const fields = await Joi.validate(inputData, schema, {
      abortEarly: false
    })
    return { hasError: false, fields }
  } catch ({ details }) {
    let err = details[0]
    let error = {
      message: `The field ${err.path[0]} is empty`,
      code: globalfunc.getKeyByValue(constants.ERROR_CODES, constants.ERROR_CODES.USR_02),
      field: `${err.path[0]}`,
      status: constants.NETWORK_CODES.HTTP_BAD_REQUEST
    }
    return { hasError: true, error }
  }
}
