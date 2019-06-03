/* eslint-disable camelcase */
import networkRequest from '../utils/networkRequest'
import envconfig from '../config/envconfig'
import logger from '../utils/errors/errorlogger'
import rabbitmq from '../config/rabbitmq'
import Email from 'email-templates'

function getKeyByValue (object, value) {
  return Object.keys(object).find(key => object[key] === value)
}

function getPageParams (request) {
  const { page, limit, description_length } = request
  const numberOfPage = parseInt(page, 10) || 1
  const pageLimit = parseInt(limit, 10) || 20
  const descriptionLength = parseInt(description_length, 10) || 200

  return { numberOfPage, pageLimit, descriptionLength }
}
function getCustomerDetails (user_key) {
  let url = envconfig.customerURL
  try {
    let customer = networkRequest.getRequest(url, { user_key })
    return customer
  } catch (error) {
    logger.error(error)
  }
}

const isValueValid = (id) => {
  let valid = false
  const parsedId = parseInt(id, 10)
  !isNaN(parsedId) && (valid = true)
  return { valid, parsedId }
}

function convertObjectValuesRecursive (obj, target, replacement) {
  obj = { ...obj }
  Object.keys(obj).forEach((key) => {
    if (obj[key] === target) {
      obj[key] = replacement
    } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      obj[key] = convertObjectValuesRecursive(obj[key], target, replacement)
    }
  })
  return obj
}

function getToken (req) {
  const { user_key } = req
  const userKey = user_key.split(' ')
  return userKey[1]
}
function buildNotificationPayload (customer, cart) {
  const email = new Email()
  let msg = {
    notification_type: 'EMAIL',
    payload: {
      to: customer.email,
      from: 'samelikzra@gmail.com',
      subject: 'ORDER DETAILS',
      text: 'FROM CODE',
      html: '<strong>We are fine</strong>'
    }
  }
  return JSON.stringify(msg)
}

async function pushToQueue (msg) {
  rabbitmq(msg)
}

export default { buildNotificationPayload, getCustomerDetails, getKeyByValue, getPageParams, isValueValid, convertObjectValuesRecursive, getToken, pushToQueue }
