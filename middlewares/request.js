/* eslint-disable camelcase */
import isEmpty from 'lodash.isempty'
import cache from '../utils/cache'
import network from '../utils/networkRequest'
import envConfig from '../config/envconfig'
import constants from '../constants'

export function getTax (req, res, next) {
  const { tax_id } = req.body
  const { user_key } = req.headers
  let tax = getData(
    `/v1/api/tax/${tax_id}`,
    envConfig.taxUrl + `/${tax_id}`,
    user_key
  )
  req.tax = tax
  return next()
}
export async function getShipping (req, res, next) {
  const { shipping_id } = req.body
  const { user_key } = req.headers
  let shipping = await getData(
    `/v1/api/shippings/regions/${shipping_id}`,
    envConfig.shippingUrl + `/${shipping_id}`,
    user_key
  )
  req.shipping = shipping
  return next()
}

export function getCart (req, res, next) {
  const { cart_id } = req.body
  const { user_key } = req.headers

  let cart = getData(
    `/v1/api/shoppingcart/${cart_id}`,
    envConfig.cartUrl + `/${cart_id}`,
    user_key
  )
  req.cart = cart
  return next()
}

async function getData (key, url, user_key) {
  let response = await cache.checkCache(key)
  if (response == null) {
    let header = {
      user_key
    }
    response = await network.getRequest(url, header)

    if (!isEmpty(response.data)) {
      return null
    }

    cache.addToCache(key, response.data, constants.CACHE_TYPES.hour)
    response = response.data
  }
  return response
}
