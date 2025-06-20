import jwt from 'jsonwebtoken'

export default function (req, res, next) {
  const authHeader = req.header('Authorization')
  if (!authHeader) return res.status(401).json({ msg: 'No token, authorization denied' })

  const token = authHeader.split(' ')[1]  // ✅ split "Bearer <token>"

  if (!token) return res.status(401).json({ msg: 'No token found' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded.userId
    next()
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' })
  }
}


