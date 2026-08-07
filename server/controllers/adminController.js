import Complaint from '../models/Complaint.js';
import Department from '../models/Department.js';
import User from '../models/User.js';
import { isDbConnected } from '../config/db.js';
import { memoryStore } from '../utils/memoryStore.js';

export const getAdminStats = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const totalUsers = await User.countDocuments({ role: 'Citizen' });
      const totalOfficers = await User.countDocuments({ role: 'Department Officer' });
      const totalDepartments = await Department.countDocuments();
      const totalComplaints = await Complaint.countDocuments();

      const pendingComplaints = await Complaint.countDocuments({ status: { $in: ['Submitted', 'Assigned', 'In Progress'] } });
      const resolvedComplaints = await Complaint.countDocuments({ status: { $in: ['Resolved', 'Closed'] } });
      const rejectedComplaints = await Complaint.countDocuments({ status: 'Rejected' });
      const resolutionRate = totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0;

      const categoryStats = await Complaint.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      const departmentStats = await Complaint.aggregate([
        { $group: { _id: '$departmentName', count: { $sum: 1 }, resolved: { $sum: { $cond: [{ $in: ['$status', ['Resolved', 'Closed']] }, 1, 0] } } } },
        { $sort: { count: -1 } }
      ]);

      return res.status(200).json({
        success: true,
        stats: { totalUsers, totalOfficers, totalDepartments, totalComplaints, pendingComplaints, resolvedComplaints, rejectedComplaints, resolutionRate },
        charts: { categoryStats, departmentStats }
      });
    }

    // In-memory Fallback Stats
    const totalUsers = memoryStore.users.filter((u) => u.role === 'Citizen').length;
    const totalOfficers = memoryStore.users.filter((u) => u.role === 'Department Officer').length;
    const totalDepartments = memoryStore.departments.length;
    const totalComplaints = memoryStore.complaints.length;

    const pendingComplaints = memoryStore.complaints.filter((c) => ['Submitted', 'Assigned', 'In Progress'].includes(c.status)).length;
    const resolvedComplaints = memoryStore.complaints.filter((c) => ['Resolved', 'Closed'].includes(c.status)).length;
    const rejectedComplaints = memoryStore.complaints.filter((c) => c.status === 'Rejected').length;
    const resolutionRate = totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0;

    const categoryMap = {};
    memoryStore.complaints.forEach((c) => {
      categoryMap[c.category] = (categoryMap[c.category] || 0) + 1;
    });
    const categoryStats = Object.keys(categoryMap).map((k) => ({ _id: k, count: categoryMap[k] }));

    res.status(200).json({
      success: true,
      stats: { totalUsers, totalOfficers, totalDepartments, totalComplaints, pendingComplaints, resolvedComplaints, rejectedComplaints, resolutionRate },
      charts: { categoryStats, departmentStats: [] }
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query;

    if (isDbConnected()) {
      const query = {};
      if (role) query.role = role;
      if (search) {
        const reg = new RegExp(search, 'i');
        query.$or = [{ name: reg }, { email: reg }];
      }
      const users = await User.find(query).populate('department', 'departmentName code').sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: users.length, users });
    }

    let list = [...memoryStore.users];
    if (role) list = list.filter((u) => u.role === role);
    if (search) {
      const term = search.toLowerCase();
      list = list.filter((u) => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term));
    }

    res.status(200).json({ success: true, count: list.length, users: list });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { role, departmentId } = req.body;

    if (isDbConnected()) {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      if (role) user.role = role;
      if (departmentId !== undefined) user.department = departmentId || null;
      await user.save();
      return res.status(200).json({ success: true, message: 'User updated', user });
    }

    const user = memoryStore.users.find((u) => u._id === req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (role) user.role = role;

    res.status(200).json({ success: true, message: 'User updated (In-Memory)', user });
  } catch (error) {
    next(error);
  }
};
