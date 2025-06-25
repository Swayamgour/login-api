import Order from '../models/Order.js'
import Cart from '../models/Cart.js'

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user

    const cart = await Cart.findOneAndUpdate(
      { userId },
      {
        $set: {
          items: [],
          subTotal: 0,
          finalTotal: 0,
          updatedAt: new Date()
        }
      }
    )

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ msg: 'Cart is empty' })
    }

    const order = new Order({
      userId,
      items: cart.items.map(item => ({
        itemId: item.itemId,
        name: item.name,
        size: item.size,
        crust: item.crust,
        toppings: item.toppings,
        quantity: item.quantity,
        instructions: item.instructions,
        pricePerUnit: item.pricePerUnit,
        totalPrice: item.totalPrice
      })),
      subTotal: cart.subTotal,
      finalTotal: cart.finalTotal,
      deliveryCharge: cart.deliveryCharge,
      discount: cart.discount,
      status: 'Placed'
    })

    await order.save()

    // Clear cart
    cart.items = []
    cart.subTotal = 0
    cart.finalTotal = 0
    await cart.save()

    res.status(201).json({ msg: 'Order placed successfully', order })
  } catch (err) {
    console.error('Place order error:', err.message)
    res.status(500).json({ error: 'Failed to place order' })
  }
}
export const getOrderHistory = async (req, res) => {
  try {
    const userId = req.user
    const orders = await Order.find({ userId }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order history' })
  }
}
