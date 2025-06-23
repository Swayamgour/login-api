import express from 'express'
import auth from '../middleware/auth.js'
import {
  placeOrder,
  getMyOrders
} from '../controllers/orderController.js'

const router = express.Router()

router.post('/place', auth, placeOrder)
router.get('/my-orders', auth, getMyOrders)

export default router

