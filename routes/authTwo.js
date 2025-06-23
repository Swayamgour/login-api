// routes/auth.js
import express from 'express'
import otpGenerator from 'otp-generator'
import User from '../models/User.js'
import { sendOTPEmail } from '../utils/emailService.js'
import jwt from 'jsonwebtoken'

const router = express.Router()

// Send OTP via email
router.post('/send-email-otp', async (req, res) => {
  const { email } = req.body

  function generateNumericOTP (length = 6) {
    let otp = ''
    for (let i = 0; i < length; i++) {
      otp += Math.floor(Math.random() * 10)
    }
    return otp
  }

  const otp = generateNumericOTP()
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000)

  let user = await User.findOne({ email })
  if (!user) user = new User({ email })

  user.otp = otp
  user.otpExpiry = otpExpiry
  await user.save()

  await sendOTPEmail(email, otp)

  res.json({ msg: 'OTP sent to your email.' })
})

// Verify OTP

router.post('/verify-email-otp', async (req, res) => {
  const { email, otp } = req.body

  const user = await User.findOne({ email })
  if (!user || user.otp !== otp)
    return res.status(400).json({ msg: 'Invalid OTP' })

  if (user.otpExpiry < new Date())
    return res.status(400).json({ msg: 'OTP expired' })

  // ✅ Clear OTP
  user.otp = null
  user.otpExpiry = null
  await user.save()

  // ✅ Generate JWT token
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '100y' } // token valid for 1 day
  )

  res.json({ msg: 'OTP verified, login successful', token })
})

export default router
