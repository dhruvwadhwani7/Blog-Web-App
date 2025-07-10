import express from 'express';
import { registerUser, loginUser , getProfile, updateUser} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile',protect, getProfile);
router.put('/update', protect, upload.single('avatar'), updateUser);

export default router;
