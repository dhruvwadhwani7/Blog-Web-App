import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { isAdmin } from '../config/admin.js';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
  const { name, email, phone, password, avatar, bio, role } = req.body; 

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = await User.create({ name, email, phone, password, avatar, bio, role }); 
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone, 
        role: user.role,
      },
      token: generateToken(user),
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  
  const admin = isAdmin(email, password);
  if (admin) {
    const token = jwt.sign(
      { email: admin.email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      user: {
        email: admin.email,
        role: 'admin',
      },
      token,
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone, 
        role: user.role,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

export const getProfile = (req, res) => {
  res.json({ user: req.user });
};


export const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, phone, bio } = req.body;

    const updateFields = {
      ...(name && { name }),
      ...(email && { email }),
      ...(phone && { phone }),
      ...(bio && { bio }),
    };

    if (req.file) {
      updateFields.avatar = `/uploads/${req.file.filename}`; // Relative path to image
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
      role: updatedUser.role,
    });
  } catch (err) {
    console.error('User update failed:', err);
    res.status(500).json({ message: 'Failed to update user', error: err.message });
  }
};
