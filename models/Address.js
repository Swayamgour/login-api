import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  addressLine: String,
  city: String,
  pincode: String,
  phone: String,
  landmark: String,
  isDefault: {
    type: Boolean,
    default: false
  }
})

export default mongoose.model('Address', addressSchema)
