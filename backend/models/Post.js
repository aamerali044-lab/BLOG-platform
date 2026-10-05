const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

postSchema.methods.toClient = function () {
  return {
    id: this._id,
    title: this.title,
    content: this.content,
    author: this.author._id ? { id: this.author._id, username: this.author.username } : this.author,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
}

module.exports = mongoose.model('Post', postSchema)
