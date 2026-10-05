const express = require('express')
const Comment = require('../models/Comment')
const requireAuth = require('../middleware/auth')

const router = express.Router()

router.delete('/:id', requireAuth, async (req, res) => {
  const comment = await Comment.findById(req.params.id)
  if (!comment) return res.status(404).json({ error: 'Comment not found' })
  if (comment.author.toString() !== req.userId) {
    return res.status(403).json({ error: 'You can only delete your own comments' })
  }
  await comment.deleteOne()
  res.json({ deleted: req.params.id })
})

module.exports = router
