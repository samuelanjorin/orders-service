/* eslint-disable camelcase */
import networkRequest from '../utils/networkRequest'
import envconfig from '../config/envconfig'
import logger from '../utils/errors/errorlogger'
import rabbitmq from '../config/rabbitmq'
import emailInvoice from './invoice'
import constants from '../constants/index'

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
async function getCustomerDetails (user_key) {
  let url = envconfig.customerURL
  try {
    let response = await networkRequest.getRequest(url, { user_key })
    return response
  } catch (error) {
    logger.error(error)
  }
}

async function emptyCart (cart_id) {
  let url = envconfig.emptyCartURL + '/' + cart_id
  try {
    let response = await networkRequest.deleteRequest(url)
    return response
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
function buildNotificationPayload (customer, tax, shipping, cart) {
  const itemArray = []
  let totalSum = 0
  cart.forEach((item) => {
    itemArray.push({
      itemId: item.item_id,
      name: item.name,
      attributes: item.attributes,
      price: '$' + item.price,
      quantity: item.quantity

    })
    if (totalSum < item.subtotal) {
      totalSum = item.subtotal
    }
  })
  const taxAmount = ((parseFloat(tax.tax_percentage) * totalSum) / 100)
  tax.amount = parseFloat(Math.round(taxAmount * 100) / 100).toFixed(2)
  totalSum = totalSum + taxAmount + parseFloat(shipping.shipping_cost)
  totalSum = parseFloat(Math.round(totalSum * 100) / 100).toFixed(2)

  let data = {
    name: customer.name,
    tax,
    shipping,
    order: itemArray,
    totalSum
  }
  let html = emailInvoice(data)
  //  console.log(html)

  let msg = {
    notification_type: 'EMAIL',
    payload: {
      to: customer.email,
      from: 'samuelanjorin12@gmail.com',
      subject: 'ORDER DETAILS',
      text: 'Invoice Detials',
      html: html

    }
  }
  return JSON.stringify(msg)
}

async function pushToQueue (msg) {
  await rabbitmq(msg)
  logger.info('payload sent to notification service')
}
async function sendNotification (user_key, tax, shipping, cart) {
  const response = await getCustomerDetails(user_key)
  if (response !== null) {
    if (response.status === constants.NETWORK_CODES.HTTP_SUCCESS) {
      let msg = await buildNotificationPayload(response.data, tax, shipping, cart)
      await pushToQueue(msg)
    }
  }
}

export default { buildNotificationPayload,
  getCustomerDetails,
  getKeyByValue,
  getPageParams,
  isValueValid,
  convertObjectValuesRecursive,
  getToken,
  emptyCart,
  sendNotification }
