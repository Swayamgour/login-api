import express from 'express'
import auth from '../middleware/auth.js'
import {
  saveAddress,
  getUserAddresses
} from '../controllers/addressController.js'

const router = express.Router()

router.post('/add', auth, saveAddress)
router.get('/', auth, getUserAddresses)

export default router

