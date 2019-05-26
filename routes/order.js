import { Router } from 'express'
import controller from '../controllers/order'
import authenticate from '../middlewares/authenticate'
import { getCart } from '../middlewares/request'
import validate from '../middlewares/validateRequest'

const router = Router()

router.get('/inCustomer', authenticate.verifyUser, controller.getCustomersOrders())
router.get('/:order_id', authenticate.verifyUser, controller.getOrderById())
router.post('/', authenticate.verifyUser, validate,
  getCart,
  controller.createOrder())
router.get('/shortDetail/:order_id', authenticate.verifyUser, controller.getShortDetails())

export default router
