import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true
      },
      name: String,
      size: String, // e.g., Small, Medium, Large
      crust: String, // e.g., Cheese Burst, Thin Crust
      toppings: [String], // e.g., Extra Cheese, Olives
      quantity: Number,
      pricePerUnit: Number,
      totalPrice: Number,
      instructions: String // Optional user input
    }
  ],
  subTotal: Number,
  deliveryCharge: Number,
  discount: Number,
  finalTotal: Number,
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

const Cart = mongoose.model('Cart', cartSchema)
export default Cart
