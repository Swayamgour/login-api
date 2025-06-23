import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  items: [
    {
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem'
      },
      quantity: Number,
      price: Number
    }
  ],
  address: {
    type: String,
    required: true
  },
  paymentMode: {
    type: String,
    enum: ['COD', 'Online'],
    default: 'COD'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Placed', 'Preparing', 'On the way', 'Delivered', 'Cancelled'],
    default: 'Placed'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Order', orderSchema)
