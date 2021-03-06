import { Router } from 'express'
import controller from '../controllers/order'
import authenticate from '../middlewares/authenticate'
import { getCart, getShipping, getTax } from '../middlewares/request'
import validate from '../middlewares/validator'

const router = Router()

router.get('/inCustomer', authenticate.verifyUser, controller.getCustomersOrders())
router.get('/:order_id', authenticate.verifyUser, controller.getOrderById())
router.put('/:order_id', controller.confirmPayment())
router.post('/', authenticate.verifyUser, validate, getCart, getShipping, getTax, controller.createOrder())
router.get('/shortDetail/:order_id', authenticate.verifyUser, controller.getShortDetails())

export default router
