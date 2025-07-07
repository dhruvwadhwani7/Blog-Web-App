// User model schema
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  avatar: String,
  bio: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('User', userSchema)
