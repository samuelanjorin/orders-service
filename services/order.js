/* eslint-disable no-return-await */
/* eslint-disable camelcase */
import db from '../models/index'
import logger from '../utils/errors/errorlogger'

const { orders, order_detail } = db

async function getOrderByCustomerId (id) {
  return await orders.findAll({
    where: {
      customer_id: id
    }
  }
  )
}
async function getOrderDetailsByOrderId (order_id) {
  return await order_detail.findAll({
    where: {
      order_id
    }
  }
  )
}
async function getShortOrderByOrderId (order_id) {
  return await orders.findOne({
    where: {
      order_id
    }
  }
  )
}
async function updateOrderPaymentDetails (order_id) {
  try {
    await orders.update(
      { status: 1 },
      { returning: true, where: { order_id } }
    )
  } catch (error) {
    logger.error(error.errors[0].Error)
  }
}

async function createOrders (payLoad) {
  return await orders.create(payLoad)
}
async function createOrderDetails (items) {
  return await order_detail.bulkCreate(items, {
    fields: ['item_id', 'order_id', 'product_id',
      'attributes', 'product_name', 'quantity', 'unit_cost'],
    updateOnDuplicate: ['item_id']
  })
}

export default {
  createOrders,
  getOrderByCustomerId,
  getOrderDetailsByOrderId,
  getShortOrderByOrderId,
  createOrderDetails,
  updateOrderPaymentDetails

}
