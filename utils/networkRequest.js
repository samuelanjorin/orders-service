import axios from 'axios'
import logger from './errors/errorlogger'
import constants from '../constants/index'
/**
 * @description handles post requests
 *
 * @param {string} url link to direct to
 * @param {Object} headers
 * @param {string} formData
 * @returns {Object}  JSON
 */
const postRequest = function (url, headers, formData) {
  let headersConfig = {
    headers
  }
  try {
    return axios.post(
      url,
      formData,
      headersConfig
    )
  } catch (err) {
    logger.error(err)
  }
}

/**
 * @description handles bearer token authentication
 *
 * @param {string} url link to direct to
 * @param {Object} header
 * @returns {Object}  JSON
 */
const getRequest = async function (url, headers) {
  try {
    let response
    let headersConfig
    if (headers) {
      headersConfig = {
        headers
      }
      response = await axios.get(url, headersConfig)
    } else {
      response = await axios.get(url)
    }
    if (response.status === constants.NETWORK_CODES.HTTP_SUCCESS) {
      return response.data
    }
    return null
  } catch (err) {
    logger.error(err)
  }
}

export default { postRequest, getRequest }
