import Order from '../models/Order.js'

export const placeOrder = async (req, res) => {
  const { items, address, paymentMode, totalAmount } = req.body
  const userId = req.user

  const newOrder = new Order({
    userId,
    items,
    address,
    paymentMode,
    totalAmount
  })

  await newOrder.save()
  res.json({ msg: 'Order placed successfully', order: newOrder })
}

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user }).sort({ createdAt: -1 })
  res.json(orders)
}
