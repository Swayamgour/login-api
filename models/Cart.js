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
        ref: 'MenuItem'
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ],
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Cart', cartSchema)
