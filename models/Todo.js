import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  }
})

export default mongoose.model('Todo', todoSchema)
