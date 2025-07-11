import express from 'express';
import {
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  getBlogsByUser,
  upload
} from '../controllers/blogController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, upload.array('media', 5), createBlog);
router.put('/:id', protect, upload.array('media', 5), updateBlog);
router.delete('/:id', protect, deleteBlog);
router.get('/', getAllBlogs);
router.get('/my-blogs', protect, getBlogsByUser);
router.get('/:id', getBlogById);

export default router;
