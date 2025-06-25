// models/Order.js
import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [
    {
      itemId: mongoose.Schema.Types.ObjectId,
      name: String,
      size: String,
      crust: String,
      toppings: [String],
      quantity: Number,
      pricePerUnit: Number,
      totalPrice: Number,
      instructions: String
    }
  ],
  subTotal: Number,
  finalTotal: Number,
  deliveryCharge: Number,
  discount: Number,
  status: { type: String, default: 'Placed' },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('Order', orderSchema)
