/* eslint-disable camelcase */
import jwt from 'jsonwebtoken'
import constants from '../constants'
import globalFunctions from '../utils/globalfunc'
import envconfig from '../config/envconfig'

const verifyUser = (req, res, next) => {
  try {
    const { user_key } = req.headers
    if (user_key === (undefined || null || '')) {
      return res.status(constants.NETWORK_CODES.HTTP_UN_AUTHORISED).json({

        status: constants.NETWORK_CODES.HTTP_UN_AUTHORISED,
        code: globalFunctions.getKeyByValue(constants.ERROR_CODES, constants.ERROR_CODES.AUT_01),
        message: constants.ERROR_CODES.AUT_01,
        field: constants.ERROR_CODES.NOAUTHS

      })
    }
    const userKey = user_key.split(' ')
    const token = userKey[1]
    const decode = jwt.verify(token, envconfig.appSecret)
    req.user = decode
    return next()
  } catch (error) {
    return res.status(constants.NETWORK_CODES.HTTP_UN_AUTHORISED).json({
      status: constants.NETWORK_CODES.HTTP_UN_AUTHORISED,
      code: globalFunctions.getKeyByValue(constants.ERROR_CODES, constants.ERROR_CODES.AUT_02),
      message: constants.ERROR_CODES.AUT_02,
      field: 'token'

    })
  }
}
export default { verifyUser }
