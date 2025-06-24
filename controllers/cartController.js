import mongoose from 'mongoose'
import Cart from '../models/Cart.js'

// ✅ Add Item to Cart

export const addToCart = async (req, res) => {
  try {
    const { itemId, quantity } = req.body
    const userId = req.user

    const itemObjectId = new mongoose.Types.ObjectId(itemId)

    // Check if cart already exists
    let cart = await Cart.findOne({ userId })

    if (!cart) {
      // First time cart creation
      cart = new Cart({
        userId,
        items: [{ itemId: itemObjectId, quantity }]
      })
    } else {
      // Check if item already exists
      const existingItemIndex = cart.items.findIndex(
        item => item.itemId.toString() === itemObjectId.toString()
      )

      if (existingItemIndex !== -1) {
        // ✅ Item exists → update quantity
        cart.items[existingItemIndex].quantity += quantity
      } else {
        // ✅ New item → push into array
        cart.items.push({ itemId: itemObjectId, quantity })
      }
    }

    await cart.save()
    res.status(200).json({ msg: 'Item added to cart', cart })
  } catch (err) {
    console.error('Add to cart error:', err.message)
    res.status(500).json({ error: 'Failed to add to cart' })
  }
}

// ✅ Get Cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user
    const cart = await Cart.findOne({ userId }).populate('items.itemId')
    res.status(200).json(cart || { items: [] })
  } catch (err) {
    console.error('Error in getCart:', err.message)
    res.status(500).json({ error: 'Failed to fetch cart' })
  }
}

// ✅ Remove Item from Cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id
    const { itemId } = req.params

    const cart = await Cart.findOne({ userId })

    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' })
    }

    cart.items = cart.items.filter(
      item => item.itemId?.toString() !== itemId.toString()
    )

    await cart.save()
    res.status(200).json({ msg: 'Item removed', cart })
  } catch (err) {
    console.error('Error in removeFromCart:', err.message)
    res.status(500).json({ error: 'Failed to remove item from cart' })
  }
}
