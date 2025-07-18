import Comment from "../models/Comment.js";

export const addComment = async (req, res) => {
  try {
  
    const { content } = req.body;
    const postId = req.params.postId;

    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const comment = await Comment.create({
      content,
      postId,
      userId: req.user._id,
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add comment' });
  }
};

export const getCommentsByPost = async (req, res) => {
  try {
    const postId = req.params.postId;

    const comments = await Comment.find({ postId })
      .sort({ createdAt: -1 }) 
      .populate('userId', 'name avatar');

    const count = comments.length;

    res.status(200).json({
      count,
      comments,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch comments' });
  }
};


export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await comment.remove();
    res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete comment' });
  }
};
