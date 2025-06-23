import express from 'express'
import auth from '../middleware/auth.js'
import {
  addToCart,
  getCart,
  removeFromCart
} from '../controllers/cartController.js'

const router = express.Router()

router.post('/add', auth, addToCart)
router.get('/', auth, getCart)
router.delete('/remove/:itemId', auth, removeFromCart)

export default router
