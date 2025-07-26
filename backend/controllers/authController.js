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
        avatar: user.avatar,
        bio: user.bio
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load profile', error: err.message });
  }
};


export const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, phone, bio } = req.body;

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (email !== undefined) updateFields.email = email;
    if (phone !== undefined) updateFields.phone = phone;
    if (bio !== undefined) updateFields.bio = bio;
    if (req.file) updateFields.avatar = `/uploads/${req.file.filename}`;

    if (req.file) {
      updateFields.avatar = `/uploads/${req.file.filename}`;
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

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const subscribeToNewsletter = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.subscribedToNewsletter) {
      return res.status(409).json({ message: 'Already subscribed' });
    }

    user.subscribedToNewsletter = true;
    await user.save();

    res.status(200).json({ message: 'Successfully subscribed!' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching user by ID:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const saveBlogToUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { blogId } = req.body;

    if (!blogId) {
      return res.status(400).json({ message: 'Blog ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.savedBlogs.includes(blogId)) {
      user.savedBlogs.push(blogId);
      await user.save();
    }

    res.status(200).json({ message: 'Blog saved', blogId });
  } catch (error) {
    console.error('Error in saveBlogToUser:', error);
    res.status(500).json({ message: 'Server error while saving blog' });
  }
};

export const getSavedBlogs = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId).populate({
      path: 'savedBlogs',
      populate: { path: 'authorId', select: 'name avatar' }
    });

    res.status(200).json(user.savedBlogs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch saved blogs' });
  }
};

export const unsaveBlogFromUser = async (req, res) => {
  const userId = req.user._id;
  const { blogId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.savedBlogs = user.savedBlogs.filter(
      (savedId) => savedId.toString() !== blogId
    );

    await user.save();

    res.status(200).json({ message: 'Blog unsaved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to unsave blog', error: error.message });
  }
};
