import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { isDbConnected } from '../config/db.js';
import { memoryStore } from '../utils/memoryStore.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'civicroute_super_secret_jwt_key_2026');

      if (isDbConnected() && mongoose.Types.ObjectId.isValid(decoded.id)) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        req.user = memoryStore.users.find((u) => u._id === decoded.id);
      }

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found or session expired' });
      }

      return next();
    } catch (error) {
      console.error('[Auth Middleware Notice]', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};
