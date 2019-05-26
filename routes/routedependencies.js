import bodyParser from 'body-parser'
import rateLimiter from '../middlewares/rateLimit'
import order from './order'

export default (app) => {
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(rateLimiter)
  app.use('/v1/api/orders', order)
}
