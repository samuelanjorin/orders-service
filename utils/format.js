/* eslint-disable camelcase */

const prepareOrderInfo = (orders) => {
  const allOrders = []
  orders.forEach(item => {
    allOrders.push({
      order_id: item.order_id,
      product_id: item.product_id,
      attributes: item.attributes,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_cost: item.unit_cost,
      subtotal: item.quantity * item.unit_cost
    })
  })

  return allOrders
}

const prepareItems = (products, order_id) => {
  let items = []

  products.forEach(item => {
    items.push({
      item_id: item.item_id,
      order_id,
      product_id: item.product_id,
      attributes: item.attributes,
      product_name: item.name,
      quantity: item.quantity,
      unit_cost: item.price
    })
  })
  return items
}

export default {
  prepareItems,
  prepareOrderInfo

}
