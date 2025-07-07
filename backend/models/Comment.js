// Comment model schema
const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  timestamp: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Comment', commentSchema)
