import express from 'express'
import auth from '../middleware/auth.js'
import {
  placeOrder,
  // getMyOrders,
  getOrderHistory
} from '../controllers/orderController.js'

const router = express.Router()

router.post('/place', auth, placeOrder)
router.get('/myOrders', auth, getOrderHistory)

export default router

