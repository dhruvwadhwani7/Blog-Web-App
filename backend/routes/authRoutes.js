import express from 'express';
import { registerUser, loginUser , getProfile, updateUser,getAllUsers,deleteUser,getUserById, subscribeToNewsletter, saveBlogToUser, getSavedBlogs, unsaveBlogFromUser} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';


const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile',protect, getProfile);
router.put('/update', protect, upload.single('avatar'), updateUser);
router.get('/users', protect, getAllUsers);
router.delete('/users/:id', protect, deleteUser);
router.get('/user/:id', getUserById);
router.post('/subscribe', subscribeToNewsletter);
router.post('/save-blog', protect, saveBlogToUser);
router.get('/saved-blogs', protect, getSavedBlogs);
router.delete('/unsave/:id', protect, unsaveBlogFromUser);

export default router;
