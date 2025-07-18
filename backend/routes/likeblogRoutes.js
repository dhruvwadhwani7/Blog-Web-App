import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getLikeCount, isPostLiked, likePost, unlikePost } from '../controllers/LikeController.js';

const router = express.Router();


router.post('/:postId', protect, likePost);
router.delete('/:postId', protect, unlikePost);
router.get('/:postId', getLikeCount);
router.get('/:postId/is-liked', protect, isPostLiked);

export default router;
