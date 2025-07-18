
import mongoose from 'mongoose';


const likeSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
})

export default mongoose.model('Like', likeSchema)
