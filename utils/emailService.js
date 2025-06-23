// utils/emailService.js
import nodemailer from 'nodemailer'
// import dotenv from ''

import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your Gmail ID
    pass: process.env.EMAIL_PASS // App password (not your Gmail password!)
  }
})

// console.log('EMAIL_USER:', process.env.EMAIL_USER)
// console.log('EMAIL_PASS:', process.env.EMAIL_PASS)

export const sendOTPEmail = async (to, otp) => {
  const mailOptions = {
    from: `"My App" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your OTP Code',
    html: `<h2>Your OTP is: ${otp}</h2><p>It will expire in 5 minutes.</p>`
  }

  await transporter.sendMail(mailOptions)
}
