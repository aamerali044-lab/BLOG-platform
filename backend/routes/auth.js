const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const requireAuth = require('../middleware/auth')

const router = express.Router()

function signToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'username, email, and password are required' })
  }

  const existing = await User.findOne({ $or: [{ email }, { username }] })
  if (existing) {
    return res.status(409).json({ error: 'Username or email already in use' })
  }

  const user = new User({ username, email })
  await user.setPassword(password)
  await user.save()

  const token = signToken(user._id)
  res.status(201).json({ token, user: user.toSafeObject() })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' })
  }

  const user = await User.findOne({ email })
  if (!user || !(await user.checkPassword(password))) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  const token = signToken(user._id)
  res.json({ token, user: user.toSafeObject() })
})

router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.userId)
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json(user.toSafeObject())
})

module.exports = router
