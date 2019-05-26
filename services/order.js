/* eslint-disable no-return-await */
/* eslint-disable camelcase */
import db from '../models/index'

const { orders, order_detail } = db

async function getOrderByCustomerId (id) {
  return await orders.findOne({
    where: {
      customer_id: id
    },
    include: [{
      model: order_detail
    }]
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
  return await order_detail.findOne({
    where: {
      order_id
    }
  }
  )
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
  createOrderDetails
}
