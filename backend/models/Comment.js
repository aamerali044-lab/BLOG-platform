const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, trim: true },
  },
  { timestamps: true }
)

commentSchema.methods.toClient = function () {
  return {
    id: this._id,
    content: this.content,
    author: this.author._id ? { id: this.author._id, username: this.author.username } : this.author,
    createdAt: this.createdAt,
  }
}

module.exports = mongoose.model('Comment', commentSchema)
