/* eslint-disable camelcase */
import network from '../utils/networkRequest'
import envConfig from '../config/envconfig'
import constants from '../constants'
import logger from '../utils/errors/errorlogger'
import globalFunc from '../utils/globalfunc'
import cache from '../utils/cache'

export async function getCart (req, res, next) {
  const { cart_id } = req.body
  // const { user_key } = req.headers

  try {
    let response = await getData(
      null,
      envConfig.shoppingCartUrl + `/${cart_id}`,
      null
    )
    if (response.status !== constants.NETWORK_CODES.HTTP_SUCCESS) {
      if (response.status === constants.NETWORK_CODES.HTTP_BAD_REQUEST) {
        return res.status(constants.NETWORK_CODES.HTTP_BAD_REQUEST).json({
          code: globalFunc.getKeyByValue(constants.ERROR_CODES, constants.ERROR_CODES.CRT_01),
          message: response.data.message,
          field: 'cart_id'
        })
      }
      return res.status(constants.NETWORK_CODES.HTTP_BAD_REQUEST).json({
        code: globalFunc.getKeyByValue(constants.ERROR_CODES, constants.ERROR_CODES.ORD_01),
        message: 'Communication Error',
        field: 'cart_id'
      })
    }
    req.cart = response.data
    return next()
  } catch (error) {
    logger.error(error)
    return res.status(constants.NETWORK_CODES.HTTP_BAD_REQUEST).json({
      code: globalFunc.getKeyByValue(constants.ERROR_CODES, constants.ERROR_CODES.ORD_03),
      message: constants.ERROR_CODES.ORD_03 + ' --',
      field: 'cart_id'
    })
  }
}
export async function getShipping (req, res, next) {
  const { shipping_id } = req.body
  const { user_key } = req.headers
  try {
    let response = await getData(
      `/v1/api/shippings/regions/shipping/${shipping_id}`,
      envConfig.shippingUrl + `/${shipping_id}`,
      { user_key }
    )

    if (response.status !== constants.NETWORK_CODES.HTTP_SUCCESS) {
      if (response.status === constants.NETWORK_CODES.HTTP_BAD_REQUEST) {
        return res.status(constants.NETWORK_CODES.HTTP_BAD_REQUEST).json({
          code: globalFunc.getKeyByValue(constants.ERROR_CODES, constants.ERROR_CODES.SHP_02),
          message: response.data.message,
          field: 'shipping_id'
        })
      }
      return res.status(constants.NETWORK_CODES.HTTP_BAD_REQUEST).json({
        code: globalFunc.getKeyByValue(constants.ERROR_CODES, constants.ERROR_CODES.SHP_01),
        message: 'Communication Error',
        field: 'shipping_id'
      })
    }
    if (response.data === 'cache') {
      req.shipping = response
    } else {
      req.shipping = response.data
    }
    return next()
  } catch (error) {
    logger.error(error)
    return res.status(constants.NETWORK_CODES.HTTP_BAD_REQUEST).json({
      code: globalFunc.getKeyByValue(constants.ERROR_CODES, constants.ERROR_CODES.SHP_01),
      message: constants.ERROR_CODES.SHP_01 + ' --',
      field: 'shipping_id'
    })
  }
}
export async function getTax (req, res, next) {
  const { tax_id } = req.body
  const { user_key } = req.headers

  try {
    let response = await getData(
      `/v1/api/tax/${tax_id}`,
      envConfig.taxUrl + `/${tax_id}`,
      { user_key }
    )
    if (response.status !== constants.NETWORK_CODES.HTTP_SUCCESS) {
      if (response.status === constants.NETWORK_CODES.HTTP_BAD_REQUEST) {
        return res.status(constants.NETWORK_CODES.HTTP_BAD_REQUEST).json({
          code: globalFunc.getKeyByValue(constants.ERROR_CODES, constants.ERROR_CODES.TAX_02),
          message: response.data.message,
          field: 'tax_id'
        })
      }
      return res.status(constants.NETWORK_CODES.HTTP_BAD_REQUEST).json({
        code: globalFunc.getKeyByValue(constants.ERROR_CODES, constants.ERROR_CODES.TAX_01),
        message: 'Communication Error',
        field: 'tax_id'
      })
    }
    if (response.data === 'cache') {
      req.tax = response
    } else {
      req.tax = response.data
    }
    return next()
  } catch (error) {
    logger.error(error)
    return res.status(constants.NETWORK_CODES.HTTP_BAD_REQUEST).json({
      code: globalFunc.getKeyByValue(constants.ERROR_CODES, constants.ERROR_CODES.TAX_01),
      message: constants.ERROR_CODES.TAX_01 + ' --',
      field: 'tax_id'
    })
  }
}
async function getData (key, url, user_key) {
  let response = null
  // if (key !== null) {
  //   response = await cache.checkCache(key)
  // }
  if (response === null) {
    response = await network.getRequest(url, user_key)
  } else {
    response.data = 'cache'
    response.status = constants.NETWORK_CODES.HTTP_SUCCESS
  }
  return response
}
