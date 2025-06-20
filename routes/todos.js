import express from 'express'
import Todo from '../models/Todo.js'
import auth from '../middleware/auth.js'
// import { useId } from 'react'

const router = express.Router()

// Add Todo
router.post('/', auth, async (req, res) => {
  try {
    const todo = new Todo({
      text: req.body.text,
      userId: req.user, // Uncomment this if using authentication
    })

    await todo.save()

    // 🔥 Emit socket event to all clients
    req.io.emit('todoCreated', todo)

    res.status(201).json(todo)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create todo' })
  }
})

// Get Todos of logged-in user
router.get('/', auth, async (req, res) => {
  const todos = await Todo.find()
  res.json(todos)
})

router.put('/:id', async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id /*, userId: req.user */ }, // add userId check if using auth
      { text: req.body.text }, // ✅ Update the text now
      { new: true }
      
    )

    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' })
    }

    req.io.emit('todoUpdated', todo)

    res.json(todo)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update todo' })
  }
})

// DELETE /api/todos/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.user // ensure user can delete only their own todo
    })

    if (!todo) {
      return res
        .status(404)
        .json({ error: 'Todo not found or already deleted' })
    }

    res.json({ msg: 'Todo deleted successfully', todo })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete todo' })
  }
})

export default router
