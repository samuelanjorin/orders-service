/* eslint-disable camelcase */
import network from '../utils/networkRequest'
import envConfig from '../config/envconfig'
import constants from '../constants'
import logger from '../utils/errors/errorlogger'
import globalFunc from '../utils/globalfunc'

export async function getCart (req, res, next) {
  const { cart_id } = req.body
  const { user_key } = req.headers

  try {
    let response = await getData(
      `/v1/api/shoppingcart/${cart_id}`,
      envConfig.shoppingCartUrl + `/${cart_id}`,
      user_key
    )
    if (response.status !== constants.NETWORK_CODES.HTTP_SUCCESS) {
      if (response.status === constants.NETWORK_CODES.HTTP_BAD_REQUEST) {
        return res.status(constants.NETWORK_CODES.HTTP_BAD_REQUEST).json({
          code: globalFunc.getKeyByValue(constants.ERROR_CODES, constants.ERROR_CODES.ORD_03),
          message: response.data.message,
          field: 'cart_id'
        })
      }
      return res.status(constants.NETWORK_CODES.HTTP_BAD_REQUEST).json({
        code: globalFunc.getKeyByValue(constants.ERROR_CODES, constants.ERROR_CODES.ORD_03),
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

async function getData (key, url, user_key) {
  let response = await network.getRequest(url)
  if (response.status === 200) {
    return response
  } else {
    return response
  }
}
