import express from 'express'
import MenuItem from '../models/MenuItem.js'

const router = express.Router()

// ✅ Get a single menu item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id)
    if (!item) {
      return res.status(404).json({ error: 'Menu item not found' })
    }
    res.json(item)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch item' })
  }
})

export default router
