import Department from '../models/Department.js';
import User from '../models/User.js';
import { isDbConnected } from '../config/db.js';
import { memoryStore } from '../utils/memoryStore.js';

export const getDepartments = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const departments = await Department.find().populate('officer', 'name email phone').sort({ departmentName: 1 });
      return res.status(200).json({ success: true, count: departments.length, departments });
    }

    res.status(200).json({ success: true, count: memoryStore.departments.length, departments: memoryStore.departments });
  } catch (error) {
    next(error);
  }
};

export const createDepartment = async (req, res, next) => {
  try {
    const { departmentName, code, description, officerId, email } = req.body;

    if (isDbConnected()) {
      const existingDept = await Department.findOne({ $or: [{ departmentName }, { code: code.toUpperCase() }] });
      if (existingDept) return res.status(400).json({ success: false, message: 'Department already exists' });

      const department = await Department.create({
        departmentName,
        code: code.toUpperCase(),
        description: description || '',
        officer: officerId || null,
        email: email || ''
      });

      return res.status(201).json({ success: true, message: 'Department created', department });
    }

    const newDept = {
      _id: `dept_${Date.now()}`,
      departmentName,
      code: code.toUpperCase(),
      description: description || '',
      officer: null,
      email: email || '',
      active: true,
      createdAt: new Date()
    };

    memoryStore.departments.push(newDept);
    res.status(201).json({ success: true, message: 'Department created (In-Memory)', department: newDept });
  } catch (error) {
    next(error);
  }
};

export const updateDepartment = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
      return res.status(200).json({ success: true, department });
    }

    const dept = memoryStore.departments.find((d) => d._id === req.params.id);
    if (dept) Object.assign(dept, req.body);

    res.status(200).json({ success: true, department: dept });
  } catch (error) {
    next(error);
  }
};

export const deleteDepartment = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const department = await Department.findById(req.params.id);
      if (department) await department.deleteOne();
      return res.status(200).json({ success: true, message: 'Department deleted' });
    }

    memoryStore.departments = memoryStore.departments.filter((d) => d._id !== req.params.id);
    res.status(200).json({ success: true, message: 'Department deleted (In-Memory)' });
  } catch (error) {
    next(error);
  }
};
