import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import likeblogRoutes from './routes/likeblogRoutes.js'
import cors from 'cors';
import path from 'path';
import commentRoutes from './routes/commentRoutes.js';
import { protect } from './middleware/authMiddleware.js';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config();

const app = express();


app.use(cors({
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.get('/api/auth/profile', protect, (req, res) => {
  res.json({ success: true, user: req.user });
});
app.use('/api/likes', likeblogRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
