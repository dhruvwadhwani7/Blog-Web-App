import Like from '../models/Like.js'

export const likePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  try {
    const alreadyLiked = await Like.findOne({ postId, userId });
    if (alreadyLiked) {
      return res.status(400).json({ message: 'Already liked' });
    }

    const like = new Like({ postId, userId });
    await like.save();

    res.status(201).json({ message: 'Post liked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error liking post', error });
  }
};

export const unlikePost = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  try {
    await Like.findOneAndDelete({ postId, userId });
    res.status(200).json({ message: 'Post unliked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error unliking post', error });
  }
};
export const getLikeCount = async (req, res) => {
  const { postId } = req.params;

  try {
    const count = await Like.countDocuments({ postId });
    res.status(200).json({ likes: count });
  } catch (error) {
    res.status(500).json({ message: 'Error getting like count', error });
  }
};

export const isPostLiked = async (req, res) => {
  const { postId } = req.params;
  const userId = req.user._id;

  try {
    const liked = await Like.findOne({ postId, userId });
    res.status(200).json({ liked: !!liked });
  } catch (error) {
    res.status(500).json({ message: 'Error checking like status', error });
  }
};
