import constants from '../constants/index'


/**
 *
 *
 * @param {object} res
 * @param {number} code
 * @param {string} message
 * @param {string} field
 * @returns {object} server response
 */

function serverError (res) {
  return res.status(constants.NETWORK_CODES.HTPP_INTERNAL_SERVER).json({
    error: {
      status: constants.NETWORK_CODES.HTPP_INTERNAL_SERVER,
      message: 'Server unavailable'
    }
  })
}

export default { serverError }
