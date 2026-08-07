import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { isDbConnected } from '../config/db.js';
import { memoryStore } from '../utils/memoryStore.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'civicroute_super_secret_jwt_key_2026', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, address, role, departmentId } = req.body;
    const lowerEmail = email.toLowerCase();

    if (isDbConnected()) {
      const userExists = await User.findOne({ email: lowerEmail });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }

      const assignedRole = role && ['Citizen', 'Department Officer', 'Admin'].includes(role) ? role : 'Citizen';
      const user = await User.create({
        name,
        email: lowerEmail,
        password,
        phone: phone || '',
        address: address || '',
        role: assignedRole,
        department: departmentId || null
      });

      const token = generateToken(user._id);

      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
          department: user.department,
          createdAt: user.createdAt
        }
      });
    }

    // In-memory fallback
    const userExists = memoryStore.users.find((u) => u.email === lowerEmail);
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = {
      _id: `usr_${Date.now()}`,
      name,
      email: lowerEmail,
      password: hashedPassword,
      phone: phone || '',
      address: address || '',
      role: role || 'Citizen',
      department: departmentId || null,
      createdAt: new Date()
    };

    memoryStore.users.push(newUser);
    const token = generateToken(newUser._id);

    return res.status(201).json({
      success: true,
      message: 'Registration successful (In-Memory)',
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
        role: newUser.role,
        department: newUser.department,
        createdAt: newUser.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const lowerEmail = email.toLowerCase();

    if (isDbConnected()) {
      const user = await User.findOne({ email: lowerEmail }).select('+password').populate('department', 'departmentName code');
      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const token = generateToken(user._id);
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
          department: user.department,
          createdAt: user.createdAt
        }
      });
    }

    // In-Memory Fallback Login
    const user = memoryStore.users.find((u) => u.email === lowerEmail);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    return res.status(200).json({
      success: true,
      message: 'Login successful (In-Memory)',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        department: user.department,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const user = await User.findById(req.user._id).populate('department', 'departmentName code');
      return res.status(200).json({ success: true, user });
    }

    const user = memoryStore.users.find((u) => u._id === req.user._id);
    res.status(200).json({ success: true, user: user || req.user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;

    if (isDbConnected()) {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      if (name) user.name = name;
      if (phone !== undefined) user.phone = phone;
      if (address !== undefined) user.address = address;
      await user.save();
      return res.status(200).json({ success: true, message: 'Profile updated', user });
    }

    const user = memoryStore.users.find((u) => u._id === req.user._id);
    if (user) {
      if (name) user.name = name;
      if (phone !== undefined) user.phone = phone;
      if (address !== undefined) user.address = address;
    }

    res.status(200).json({ success: true, message: 'Profile updated', user: user || req.user });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (isDbConnected()) {
      const user = await User.findById(req.user._id).select('+password');
      if (!(await user.matchPassword(currentPassword))) {
        return res.status(400).json({ success: false, message: 'Incorrect current password' });
      }
      user.password = newPassword;
      await user.save();
      return res.status(200).json({ success: true, message: 'Password changed' });
    }

    const user = memoryStore.users.find((u) => u._id === req.user._id);
    if (user) {
      user.password = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
    }
    res.status(200).json({ success: true, message: 'Password changed' });
  } catch (error) {
    next(error);
  }
};
