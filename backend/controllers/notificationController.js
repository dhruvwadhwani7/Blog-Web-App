import Notification from '../models/Notification.js';

export const createNotification = async (req, res) => {
  try {
    const { recipient, sender, type, post, message } = req.body;

    if (!recipient || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newNotification = new Notification({
      recipient,
      sender: sender || req.user._id,
      type,
      post,
      message,
    });

    const saved = await newNotification.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .populate('sender', 'name avatar')
      .populate('post', 'title');

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (!notification.recipient.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to mark this as read' });
    }

    notification.isRead = true;
    await notification.save();
    res.json({ message: 'Marked as read', notification });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
