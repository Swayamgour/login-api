import express from 'express'
import MenuItem from '../models/MenuItem.js'
import auth from '../middleware/auth.js'

const router = express.Router()

// ✅ GET: Get all menu items
router.get('/',  async (req, res) => {
  try {
    const items = await MenuItem.find()
    res.json(items)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu' })
  }
})

// ✅ POST: Add new menu item
router.post('/',  async (req, res) => {
  try {
    const { name, description, price, category } = req.body

    if (!name || !description || !price || !category) {
      return res.status(400).json({ msg: 'All fields are required' })
    }

    const newItem = new MenuItem({
      name,
      description,
      price,
      category
    })

    await newItem.save()
    res.status(201).json({ msg: 'Menu item added successfully', item: newItem })
  } catch (error) {
    console.error('Error adding menu item:', error)
    res.status(500).json({ error: 'Failed to add menu item' })
  }
})

export default router
