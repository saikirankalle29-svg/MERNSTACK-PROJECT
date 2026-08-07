import Complaint from '../models/Complaint.js';
import Department from '../models/Department.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { isDbConnected } from '../config/db.js';
import { memoryStore } from '../utils/memoryStore.js';
import { analyzeComplaintWithAI } from '../utils/groqService.js';

export const createComplaint = async (req, res, next) => {
  try {
    const { title, description, location, category: manualCategory, priority: manualPriority } = req.body;
    if (!title || !description || !location) {
      return res.status(400).json({ success: false, message: 'Please provide title, description, and location' });
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      imageUrl = req.body.image;
    }

    const aiResult = await analyzeComplaintWithAI(title, description);
    const category = manualCategory || aiResult.category;
    const priority = manualPriority || aiResult.priority;
    const summary = aiResult.summary;
    const improvedComplaint = aiResult.improvedComplaint;
    const departmentName = aiResult.department;

    if (isDbConnected()) {
      let deptDoc = await Department.findOne({ departmentName: { $regex: new RegExp(departmentName, 'i') } });
      if (!deptDoc) deptDoc = await Department.findOne({ departmentName: { $regex: new RegExp(category, 'i') } });
      const assignedOfficerId = deptDoc && deptDoc.officer ? deptDoc.officer : null;
      const initialStatus = assignedOfficerId ? 'Assigned' : 'Submitted';

      const complaint = await Complaint.create({
        title,
        description,
        category,
        departmentName: deptDoc ? deptDoc.departmentName : departmentName,
        department: deptDoc ? deptDoc._id : null,
        priority,
        status: initialStatus,
        location,
        image: imageUrl,
        summary,
        improvedComplaint,
        citizenId: req.user._id,
        officerId: assignedOfficerId,
        timeline: [
          { status: 'Submitted', updatedBy: req.user.name, note: 'Complaint registered by citizen.' },
          ...(assignedOfficerId
            ? [{ status: 'Assigned', updatedBy: 'Groq AI Engine', note: `Auto-categorized as ${category} and routed.` }]
            : [])
        ]
      });

      if (assignedOfficerId) {
        await Notification.create({
          userId: assignedOfficerId,
          title: 'New Complaint Assigned',
          message: `High Priority complaint "${title}" assigned to your department.`,
          type: 'warning',
          link: `/officer/complaints`
        });
      }

      return res.status(201).json({ success: true, message: 'Complaint submitted', complaint });
    }

    // In-memory Fallback
    const deptObj = memoryStore.departments.find((d) => d.departmentName.toLowerCase().includes(departmentName.toLowerCase()));
    const assignedOfficer = deptObj && deptObj.officer ? deptObj.officer : null;

    const newComplaint = {
      _id: `cmp_${Date.now()}`,
      title,
      description,
      category,
      departmentName: deptObj ? deptObj.departmentName : departmentName,
      department: deptObj ? deptObj._id : null,
      priority,
      status: assignedOfficer ? 'Assigned' : 'Submitted',
      location,
      image: imageUrl,
      summary,
      improvedComplaint,
      citizenId: { _id: req.user._id, name: req.user.name, email: req.user.email },
      officerId: assignedOfficer,
      timeline: [
        { status: 'Submitted', updatedBy: req.user.name, note: 'Complaint registered by citizen.', timestamp: new Date() },
        ...(assignedOfficer
          ? [{ status: 'Assigned', updatedBy: 'Groq AI Engine', note: `Auto-routed to ${deptObj.departmentName}.`, timestamp: new Date() }]
          : [])
      ],
      remarks: [],
      createdAt: new Date()
    };

    memoryStore.complaints.unshift(newComplaint);

    res.status(201).json({ success: true, message: 'Complaint submitted (In-Memory)', complaint: newComplaint });
  } catch (error) {
    next(error);
  }
};

export const getComplaints = async (req, res, next) => {
  try {
    const { search, category, status, priority } = req.query;

    if (isDbConnected()) {
      const query = {};
      if (req.user.role === 'Citizen') query.citizenId = req.user._id;
      else if (req.user.role === 'Department Officer') {
        if (req.user.department) query.$or = [{ officerId: req.user._id }, { department: req.user.department }];
        else query.officerId = req.user._id;
      }

      if (search) {
        const reg = new RegExp(search, 'i');
        query.$or = (query.$or || []).concat([{ title: reg }, { description: reg }, { location: reg }]);
      }

      if (category) query.category = category;
      if (status) query.status = status;
      if (priority) query.priority = priority;

      const complaints = await Complaint.find(query)
        .populate('citizenId', 'name email phone')
        .populate('officerId', 'name email phone')
        .populate('department', 'departmentName code')
        .sort({ createdAt: -1 });

      return res.status(200).json({ success: true, count: complaints.length, complaints });
    }

    // In-memory Fallback
    let list = [...memoryStore.complaints];
    if (req.user.role === 'Citizen') {
      list = list.filter((c) => (c.citizenId?._id || c.citizenId) === req.user._id);
    }

    if (search) {
      const term = search.toLowerCase();
      list = list.filter((c) => c.title.toLowerCase().includes(term) || c.description.toLowerCase().includes(term));
    }
    if (category) list = list.filter((c) => c.category === category);
    if (status) list = list.filter((c) => c.status === status);
    if (priority) list = list.filter((c) => c.priority === priority);

    res.status(200).json({ success: true, count: list.length, complaints: list });
  } catch (error) {
    next(error);
  }
};

export const getComplaintById = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const complaint = await Complaint.findById(req.params.id)
        .populate('citizenId', 'name email phone address')
        .populate('officerId', 'name email phone')
        .populate('department', 'departmentName code description');
      if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
      return res.status(200).json({ success: true, complaint });
    }

    const complaint = memoryStore.complaints.find((c) => c._id === req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
    res.status(200).json({ success: true, complaint });
  } catch (error) {
    next(error);
  }
};

export const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status, remarks, officerId, priority } = req.body;

    if (isDbConnected()) {
      const complaint = await Complaint.findById(req.params.id);
      if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });

      if (priority) complaint.priority = priority;
      if (officerId) complaint.officerId = officerId;
      if (req.file) complaint.resolutionImage = `/uploads/${req.file.filename}`;

      if (status && status !== complaint.status) {
        const oldStatus = complaint.status;
        complaint.status = status;
        complaint.timeline.push({
          status,
          updatedBy: `${req.user.name} (${req.user.role})`,
          note: remarks || `Status updated from ${oldStatus} to ${status}`
        });
      }

      if (remarks) {
        complaint.remarks.push({ author: req.user.name, role: req.user.role, text: remarks });
      }

      await complaint.save();
      return res.status(200).json({ success: true, message: 'Complaint updated', complaint });
    }

    // In-memory Fallback
    const complaint = memoryStore.complaints.find((c) => c._id === req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });

    if (status && status !== complaint.status) {
      complaint.status = status;
      complaint.timeline.push({
        status,
        updatedBy: `${req.user.name} (${req.user.role})`,
        note: remarks || `Status updated to ${status}`,
        timestamp: new Date()
      });
    }
    if (remarks) {
      complaint.remarks.push({ author: req.user.name, role: req.user.role, text: remarks, createdAt: new Date() });
    }

    res.status(200).json({ success: true, message: 'Complaint updated (In-Memory)', complaint });
  } catch (error) {
    next(error);
  }
};

export const addCitizenFeedback = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    if (isDbConnected()) {
      const complaint = await Complaint.findById(req.params.id);
      if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });

      complaint.citizenFeedback = { rating: Number(rating) || 5, comment: comment || '', submittedAt: new Date() };
      complaint.status = 'Closed';
      complaint.timeline.push({
        status: 'Closed',
        updatedBy: `${req.user.name} (Citizen)`,
        note: `Verified & closed with ${rating}-star rating.`
      });

      await complaint.save();
      return res.status(200).json({ success: true, message: 'Feedback recorded', complaint });
    }

    const complaint = memoryStore.complaints.find((c) => c._id === req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });

    complaint.citizenFeedback = { rating: Number(rating) || 5, comment: comment || '', submittedAt: new Date() };
    complaint.status = 'Closed';
    complaint.timeline.push({
      status: 'Closed',
      updatedBy: `${req.user.name} (Citizen)`,
      note: `Verified & closed with ${rating}-star rating.`,
      timestamp: new Date()
    });

    res.status(200).json({ success: true, message: 'Feedback recorded (In-Memory)', complaint });
  } catch (error) {
    next(error);
  }
};

export const deleteComplaint = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const complaint = await Complaint.findById(req.params.id);
      if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });
      await complaint.deleteOne();
      return res.status(200).json({ success: true, message: 'Complaint deleted' });
    }

    memoryStore.complaints = memoryStore.complaints.filter((c) => c._id !== req.params.id);
    res.status(200).json({ success: true, message: 'Complaint deleted (In-Memory)' });
  } catch (error) {
    next(error);
  }
};
