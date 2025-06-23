// import mongoose from 'mongoose'

// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true }
// })

// export default mongoose.model('User', userSchema)


// models/User.js
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: false, // use required: true if only email login
    unique: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: false, // use required: true if only phone login
    unique: true,
  },
  otp: {
    type: String,
  },
  otpExpiry: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model('User', userSchema)

