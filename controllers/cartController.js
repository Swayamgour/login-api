import mongoose from 'mongoose'
import MenuItem from '../models/MenuItem.js' // for base price
import Cart from '../models/Cart.js'

export const addToCart = async (req, res) => {
  try {
    const userId = req.user
    const {
      itemId,
      size,
      crust,
      toppings = [],
      quantity = 1,
      instructions = ''
    } = req.body

    // 1. Validate item
    const menuItem = await MenuItem.findById(itemId)
    if (!menuItem) return res.status(404).json({ error: 'Item not found' })

    // 2. Calculate dynamic price
    let pricePerUnit = menuItem.price
    if (size === 'Medium') pricePerUnit += 50
    if (size === 'Large') pricePerUnit += 100
    if (crust === 'Cheese Burst') pricePerUnit += 30
    pricePerUnit += toppings.length * 20

    const totalPrice = pricePerUnit * quantity

    // 3. Find cart
    let cart = await Cart.findOne({ userId })
    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
        subTotal: 0,
        deliveryCharge: 40,
        discount: 0
      })
    }

    // 4. Check if same item with same customization exists
    const existingItem = cart.items.find(
      item =>
        item.itemId.toString() === itemId &&
        item.size === size &&
        item.crust === crust &&
        JSON.stringify(item.toppings.sort()) === JSON.stringify(toppings.sort())
    )

    if (existingItem) {
      existingItem.quantity += quantity
      existingItem.totalPrice += totalPrice
    } else {
      cart.items.push({
        itemId,
        name: menuItem.name,
        size,
        crust,
        toppings,
        quantity,
        pricePerUnit,
        totalPrice,
        instructions
      })
    }

    // 5. Update cart totals
    cart.subTotal = cart.items.reduce((sum, item) => sum + item.totalPrice, 0)
    cart.finalTotal =
      cart.subTotal + (cart.deliveryCharge || 0) - (cart.discount || 0)
    cart.updatedAt = new Date()

    await cart.save()

    res.status(200).json({ msg: 'Item added to cart', cart })
  } catch (err) {
    console.error('Add to cart error:', err.message)
    res.status(500).json({ error: 'Failed to add item to cart' })
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
