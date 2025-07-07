// Blog model schema
const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  coverImage: String,
  tags: [String],
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Blog', blogSchema)
