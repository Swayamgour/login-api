import Cart from '../models/Cart.js'

export const addToCart = async (req, res) => {
  const { itemId, quantity } = req.body
  const userId = req.user

  let cart = await Cart.findOne({ userId })
  if (!cart) {
    cart = new Cart({ userId, items: [{ itemId, quantity }] })
  } else {
    const existingItem = cart.items.find(item => item.itemId.toString() === itemId)
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.items.push({ itemId, quantity })
    }
  }

  await cart.save()
  res.json({ msg: 'Item added to cart', cart })
}

export const getCart = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user }).populate('items.itemId')
  res.json(cart || { items: [] })
}

export const removeFromCart = async (req, res) => {
  const { itemId } = req.params
  const cart = await Cart.findOne({ userId: req.user })

  if (!cart) return res.status(404).json({ msg: 'Cart not found' })

  cart.items = cart.items.filter(item => item.itemId.toString() !== itemId)
  await cart.save()

  res.json({ msg: 'Item removed', cart })
}
