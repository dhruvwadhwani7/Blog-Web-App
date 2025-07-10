import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === 'admin') {
      req.user = {
        email: decoded.email,
        role: 'admin',
      };
    } else {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      req.user = user;
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only' });
  }
  next();
};
