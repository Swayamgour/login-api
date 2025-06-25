// models/Order.js

import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true,
  },
  quantity: { type: Number, required: true },
  toppings: [String]
})

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    subTotal: Number,
    finalTotal: Number,
    status: {
      type: String,
      enum: ['Placed', 'Preparing', 'Delivered', 'Cancelled'],
      default: 'Placed',
    },
  },
  { timestamps: true }
)

export default mongoose.model('Order', orderSchema)
