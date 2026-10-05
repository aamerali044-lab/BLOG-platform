const express = require('express')
const Post = require('../models/Post')
const Comment = require('../models/Comment')
const requireAuth = require('../middleware/auth')

const router = express.Router()

router.get('/', async (req, res) => {
  const posts = await Post.find().populate('author', 'username').sort({ createdAt: -1 })
  res.json(posts.map((p) => p.toClient()))
})

router.get('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'username')
  if (!post) return res.status(404).json({ error: 'Post not found' })
  res.json(post.toClient())
})

router.post('/', requireAuth, async (req, res) => {
  const { title, content } = req.body
  if (!title || !content) {
    return res.status(400).json({ error: 'title and content are required' })
  }
  const post = await Post.create({ title, content, author: req.userId })
  await post.populate('author', 'username')
  res.status(201).json(post.toClient())
})

router.put('/:id', requireAuth, async (req, res) => {
  const post = await Post.findById(req.params.id)
  if (!post) return res.status(404).json({ error: 'Post not found' })
  if (post.author.toString() !== req.userId) {
    return res.status(403).json({ error: 'You can only edit your own posts' })
  }

  const { title, content } = req.body
  if (title !== undefined) post.title = title
  if (content !== undefined) post.content = content
  await post.save()
  await post.populate('author', 'username')
  res.json(post.toClient())
})

router.delete('/:id', requireAuth, async (req, res) => {
  const post = await Post.findById(req.params.id)
  if (!post) return res.status(404).json({ error: 'Post not found' })
  if (post.author.toString() !== req.userId) {
    return res.status(403).json({ error: 'You can only delete your own posts' })
  }

  await Comment.deleteMany({ post: post._id })
  await post.deleteOne()
  res.json({ deleted: req.params.id })
})

// ---------- Comments (nested under a post) ----------
router.get('/:id/comments', async (req, res) => {
  const comments = await Comment.find({ post: req.params.id })
    .populate('author', 'username')
    .sort({ createdAt: 1 })
  res.json(comments.map((c) => c.toClient()))
})

router.post('/:id/comments', requireAuth, async (req, res) => {
  const { content } = req.body
  if (!content) return res.status(400).json({ error: 'content is required' })

  const post = await Post.findById(req.params.id)
  if (!post) return res.status(404).json({ error: 'Post not found' })

  const comment = await Comment.create({ post: post._id, author: req.userId, content })
  await comment.populate('author', 'username')
  res.status(201).json(comment.toClient())
})

module.exports = router
