import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Blog from '../models/BlogSchema.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
export const upload = multer({ storage });

export const createBlog = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    const mediaFiles = req.files?.map(file => file.path);
    const newBlog = await Blog.create({
      title,
      content,
      authorId: req.user._id,
      category,
      tags: tags ? tags.split(',') : [],
      media: mediaFiles || [],
    });
    res.status(201).json(newBlog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const blog = await blogSchema.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { title, content, category, tags } = req.body;

    const mediaFiles = req.files?.map(file => file.path);
    if (mediaFiles && mediaFiles.length > 0) {
      blog.media.forEach(path => fs.existsSync(path) && fs.unlinkSync(path));
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.category = category || blog.category;
    blog.tags = tags ? tags.split(',') : blog.tags;
    blog.media = mediaFiles && mediaFiles.length > 0 ? mediaFiles : blog.media;

    const updated = await blog.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    blog.media.forEach(path => fs.existsSync(path) && fs.unlinkSync(path));

    await blog.deleteOne();
    res.json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('authorId', 'name email avatar').sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('authorId', 'name email avatar');
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBlogsByUser = async (req, res) => {
  try {
    const blogs = await Blog.find({ authorId: req.user._id }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBlogsByUserId = async (req, res) => {
  try {
    const userId = req.params.id;

    const blogs = await Blog.find({ authorId: userId }).sort({ createdAt: -1 });

    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error fetching blogs by user ID:', error);
    res.status(500).json({ message: 'Failed to fetch blogs by user ID' });
  }
};