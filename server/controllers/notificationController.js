import Notification from '../models/Notification.js';
import { isDbConnected } from '../config/db.js';
import { memoryStore } from '../utils/memoryStore.js';

export const getUserNotifications = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(30);
      const unreadCount = await Notification.countDocuments({ userId: req.user._id, read: false });
      return res.status(200).json({ success: true, unreadCount, notifications });
    }

    const userNotifs = memoryStore.notifications.filter((n) => n.userId === req.user._id);
    const unreadCount = userNotifs.filter((n) => !n.read).length;

    res.status(200).json({ success: true, unreadCount, notifications: userNotifs });
  } catch (error) {
    next(error);
  }
};

export const markNotificationAsRead = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const notification = await Notification.findOne({ _id: req.params.id, userId: req.user._id });
      if (notification) {
        notification.read = true;
        await notification.save();
      }
      return res.status(200).json({ success: true, notification });
    }

    const notif = memoryStore.notifications.find((n) => n._id === req.params.id);
    if (notif) notif.read = true;

    res.status(200).json({ success: true, notification: notif });
  } catch (error) {
    next(error);
  }
};
