const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
)

userSchema.methods.setPassword = async function (password) {
  this.passwordHash = await bcrypt.hash(password, 10)
}

userSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.passwordHash)
}

userSchema.methods.toSafeObject = function () {
  return { id: this._id, username: this.username, email: this.email }
}

module.exports = mongoose.model('User', userSchema)
