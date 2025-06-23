import mongoose from 'mongoose'

const menuItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
//   image: String,
  category: String, // pizza, drink, dessert, etc.
})

export default mongoose.model('MenuItem', menuItemSchema)
