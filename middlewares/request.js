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

export async function getCart (req, res, next) {
  const { cart_id } = req.body
  const { user_key } = req.headers

  let cart = await getData(
    `/v1/api/shoppingcart/${cart_id}`,
    envConfig.shoppingCartUrl + `/${cart_id}`,
    user_key
  )
  req.cart = cart
  return next()
}

async function getData (key, url, user_key) {
  // let response = await cache.checkCache(key)
  let response = null
  if (response === null) {
    response = await network.getRequest(url)
    if (isEmpty(response)) {
      return null
    }
    cache.addToCache(key, response, constants.CACHE_TYPES.hour)
  }

  return response
}
