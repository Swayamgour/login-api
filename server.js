import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import todoRoutes from './routes/todos.js'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'

dotenv.config()

const app = express()

// HTTP server needed for Socket.IO
const server = http.createServer(app)

// Allow CORS
const io = new Server(server, {
  cors: {
    origin: '*', // You can restrict this to your frontend IP
    methods: ['GET', 'POST']
  }
})

// Middleware
app.use(express.json())
app.use(cors({ origin: '*', methods: ['GET', 'POST'] }))

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ MongoDB Error:', err))

// API routes
app.use('/api/auth', authRoutes)
// app.use('/api/todos', todoRoutes);

app.use(
  '/api/todos',
  (req, res, next) => {
    req.io = io // attach io to request object
    next()
  },
  todoRoutes
)

// Socket.IO logic
io.on('connection', socket => {
  console.log('🔌 New client connected:', socket.id)

  // Example: Listen for a message from the client
  socket.on('sendMessage', data => {
    console.log('📨 Message from client:', data)
    // Broadcast the message to all other clients
    socket.broadcast.emit('message', data)
  })

  // On disconnect
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id)
  })
})

// Start the server
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
