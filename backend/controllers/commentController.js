import Comment from "../models/Comment.js";
import Blog from '../models/BlogSchema.js';
import Notification from '../models/Notification.js';

export const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.postId;

    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    // 1. Create the comment
    const comment = await Comment.create({
      content,
      postId,
      userId: req.user._id,
    });

    // 2. Fetch the blog post to get author
    const blog = await Blog.findById(postId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // 3. Create a notification for the blog author (if not same as commenter)
    if (blog.authorId.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: blog.authorId,
        sender: req.user._id,
        type: 'Comment',
        post: postId,
        message: `${req.user.name} commented on your post.`,
      });
    }

    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
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
