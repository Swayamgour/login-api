import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router()



// Register
router.post('/register', async (req, res) => {
  const { email, password } = req.body
  
  
  const userExist = await User.findOne({ email })
  if (userExist) return res.status(400).json({ msg: 'User already exists' })

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = new User({ email, password: hashedPassword })
  await user.save()

  res.status(201).json({ msg: 'User registered' })
})

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.status(400).json({ msg: 'Invalid credentials' })

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' })

  // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '100y' });

  res.json({ token })
})

export default router
