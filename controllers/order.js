/* eslint-disable no-return-assign */
/* eslint-disable camelcase */
import service from '../services/order'
import asyncF from '../middlewares/async'
import globalFunc from '../utils/globalfunc'
import constants from '../constants/index'
import cache from '../utils/cache'
import format from '../utils/format'

let field = 'order_id'
function getCustomersOrders () {
  return asyncF(async (req, res) => {
    const { customer_id } = req.user
    const customerOrders = await service.getOrderByCustomerId(customer_id)
    if (customerOrders !== null) {
      return res.json(customerOrders).status(constants.NETWORK_CODES.HTTP_SUCCESS)
    }
    return res.status(constants.NETWORK_CODES.HTTP_BAD_REQUEST).json({
      code: globalFunc.getKeyByValue(constants.ERROR_CODES, constants.ERROR_CODES.ORD_02),
      message: constants.ERROR_CODES.ORD_02,
      field
    })
  })
}
function createOrder () {
  return asyncF(async (req, res) => {
    const { cart, body: { shipping_id, tax_id }, user: { customer_id } } = req
    const totalAmount = cart.reduce((total_amount, item) => {
      return total_amount += item.quantity * item.price
    }, 0)
    const order = await service.createOrders({
      shipping_id,
      tax_id,
      total_amount: totalAmount,
      customer_id,
      created_on: new Date()
    })
    let order_id = order.get('order_id')
    let items = format.prepareItems(cart, order_id)
    await service.createOrderDetails(items)
    const orderKey = {
      orderId: order_id
    }
    const customer = await globalFunc.getCustomerDetails(req.headers.user_key)
    if (customer !== null) {
      let payLoad = globalFunc.buildNotificationPayload(customer, cart)
      await globalFunc.pushToQueue(payLoad)
    }
    return res.json(orderKey).status(constants.NETWORK_CODES.HTTP_CREATED)
  })
}

function getOrderById () {
  return asyncF(async (req, res) => {
    let value = await cache.checkCache(req.originalUrl)
    if (value !== null) {
      return res.json(value.data).status(constants.NETWORK_CODES.HTTP_SUCCESS)
    }

    let order = await getOrderDetails(req.params.order_id)

    if (order === null) {
      return res.status(constants.NETWORK_CODES.HTTP_BAD_REQUEST).json({
        code: globalFunc.getKeyByValue(constants.ERROR_CODES, constants.ERROR_CODES.ORD_02),
        message: constants.ERROR_CODES.ORD_02,
        field
      })
    }

    if (order === 'NotValid') {
      return res.status(constants.NETWORK_CODES.HTTP_BAD_REQUEST).json({
        code: globalFunc.getKeyByValue(constants.ERROR_CODES, constants.ERROR_CODES.ORD_01),
        message: constants.ERROR_CODES.ORD_01,
        field
      })
    }
    cache.addToCache(req.originalUrl, order, constants.CACHE_TYPES.hour)
    return res.json(order.data).status(constants.NETWORK_CODES.HTTP_SUCCESS)
  })
}
function getShortDetails () {
  return asyncF(async (req, res) => {
    let value = await cache.checkCache(req.originalUrl)
    if (value !== null) {
      return res.json(value).status(constants.NETWORK_CODES.HTTP_SUCCESS)
    }
    let order = await getOrderDetails(req.params.order_id, true)

    if (order === null) {
      return res.status(constants.NETWORK_CODES.HTTP_BAD_REQUEST).json({
        code: globalFunc.getKeyByValue(constants.ERROR_CODES, constants.ERROR_CODES.ORD_02),
        message: constants.ERROR_CODES.ORD_02,
        field
      })
    }
    if (order === 'NotValid') {
      return res.status(constants.NETWORK_CODES.HTTP_BAD_REQUEST).json({
        code: globalFunc.getKeyByValue(constants.ERROR_CODES, constants.ERROR_CODES.ORD_01),
        message: constants.ERROR_CODES.ORD_01,
        field
      })
    }

    let orderObject = order.data.dataValues

    let shortDetails = {
      order_id: orderObject.order_id,
      total_amount: orderObject.total_amount,
      created_on: orderObject.created_on,
      shipped_on: orderObject.shipped_on,
      status: orderObject.status,
      name: orderObject.name
    }

    // shortDetails = globalFunc.convertObjectValuesRecursive(shortDetails, null, '')
    cache.addToCache(req.originalUrl, shortDetails, constants.CACHE_TYPES.hour)
    return res.json(shortDetails).status(constants.NETWORK_CODES.HTTP_SUCCESS)
  })
}
async function getOrderDetails (order_id, short = false) {
  if (globalFunc.isValueValid(order_id).valid) {
    let orders
    if (short) {
      orders = await service.getShortOrderByOrderId(order_id)
    } else {
      orders = await service.getOrderDetailsByOrderId(order_id)
    }

    if (orders !== null) {
      let order = { data: orders }
      return order
    }
    return null
  }
  return 'NotValid'
}

export default {
  getCustomersOrders,
  createOrder,
  getOrderById,
  getShortDetails
}
