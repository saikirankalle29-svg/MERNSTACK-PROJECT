import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Department from '../models/Department.js';
import Complaint from '../models/Complaint.js';
import Notification from '../models/Notification.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('[Seeder] Database not connected. Skipping auto seed.');
      return;
    }

    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('[Seeder] Database already contains records. Skipping seed.');
      return;
    }

    console.log('[Seeder] Seeding database with initial CivicRoute data...');

    // 1. Create Admin
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@civicroute.gov',
      password: 'password123',
      phone: '+91 9876543210',
      address: 'City Municipal Headquarters',
      role: 'Admin'
    });

    // 2. Create Departments & Officers
    const deptList = [
      { name: 'Sanitation', code: 'SAN', email: 'sanitation@civicroute.gov', officerName: 'Officer Rajesh Kumar', officerEmail: 'officer.sanitation@civicroute.gov' },
      { name: 'Electrical Department', code: 'ELE', email: 'electrical@civicroute.gov', officerName: 'Officer Ananya Sharma', officerEmail: 'officer.electrical@civicroute.gov' },
      { name: 'Water Works Department', code: 'WAT', email: 'water@civicroute.gov', officerName: 'Officer Suresh Reddy', officerEmail: 'officer.water@civicroute.gov' },
      { name: 'Road Infrastructure', code: 'RND', email: 'roads@civicroute.gov', officerName: 'Officer Priya Patel', officerEmail: 'officer.roads@civicroute.gov' }
    ];

    const createdDepts = [];

    for (const d of deptList) {
      const officer = await User.create({
        name: d.officerName,
        email: d.officerEmail,
        password: 'password123',
        phone: '+91 9876543211',
        address: 'Municipal Officer Block B',
        role: 'Department Officer'
      });

      const dept = await Department.create({
        departmentName: d.name,
        code: d.code,
        description: `Handles all civic issues relating to ${d.name.toLowerCase()}`,
        officer: officer._id,
        email: d.email,
        active: true
      });

      officer.department = dept._id;
      await officer.save();
      createdDepts.push({ dept, officer });
    }

    // 3. Create Sample Citizens
    const citizen1 = await User.create({
      name: 'Rahul Verma',
      email: 'citizen@civicroute.com',
      password: 'password123',
      phone: '+91 9123456789',
      address: 'Plot 42, Hitech City, Madhapur',
      role: 'Citizen'
    });

    const citizen2 = await User.create({
      name: 'Sneha Rao',
      email: 'sneha@civicroute.com',
      password: 'password123',
      phone: '+91 9988776655',
      address: 'Flat 301, Jubilee Hills',
      role: 'Citizen'
    });

    // 4. Create Sample Complaints
    const sanDept = createdDepts[0];
    const eleDept = createdDepts[1];
    const watDept = createdDepts[2];
    const rndDept = createdDepts[3];

    const c1 = await Complaint.create({
      title: 'Garbage Dumped Near Bus Stop',
      description: 'There is uncollected garbage everywhere near our colony bus stop for over one week. It creates unhygienic conditions and foul smell.',
      category: 'Garbage',
      departmentName: sanDept.dept.departmentName,
      department: sanDept.dept._id,
      priority: 'High',
      status: 'In Progress',
      location: 'Madhapur Bus Stop, Cyberabad',
      summary: 'Garbage accumulation for one week creating unhygienic conditions.',
      improvedComplaint: 'Garbage has remained uncollected in the residential bus stop area for the past week, creating unhygienic conditions.',
      citizenId: citizen1._id,
      officerId: sanDept.officer._id,
      timeline: [
        { status: 'Submitted', updatedBy: citizen1.name, note: 'Complaint created' },
        { status: 'Assigned', updatedBy: 'System AI', note: 'Auto-routed to Sanitation' },
        { status: 'In Progress', updatedBy: sanDept.officer.name, note: 'Cleanup team dispatched to location.' }
      ],
      remarks: [
        { author: sanDept.officer.name, role: 'Department Officer', text: 'Sanitation truck #14 assigned for morning clearance.' }
      ]
    });

    const c2 = await Complaint.create({
      title: 'Street Light Not Working',
      description: 'Street light near block 4 bus stop has not been working for 5 days. Road is completely dark at night.',
      category: 'Street Light',
      departmentName: eleDept.dept.departmentName,
      department: eleDept.dept._id,
      priority: 'Medium',
      status: 'Submitted',
      location: 'Main Road, Jubilee Hills Block 4',
      summary: 'Street light non-functional causing night visibility issues.',
      improvedComplaint: 'The street light pole near Block 4 bus stop has been non-functional for 5 consecutive days, safety risk at night.',
      citizenId: citizen1._id,
      timeline: [
        { status: 'Submitted', updatedBy: citizen1.name, note: 'Complaint registered by citizen.' }
      ]
    });

    const c3 = await Complaint.create({
      title: 'Major Pipeline Leakage On Main Road',
      description: 'Clean drinking water is bursting from underground pipe and wasting thousands of liters water.',
      category: 'Water Supply',
      departmentName: watDept.dept.departmentName,
      department: watDept.dept._id,
      priority: 'Critical',
      status: 'Resolved',
      location: 'Kondapur Signal Junction',
      summary: 'Major drinking water pipe leak on main junction.',
      improvedComplaint: 'Main supply pipeline leak detected at Kondapur Junction causing severe water wastage.',
      citizenId: citizen2._id,
      officerId: watDept.officer._id,
      citizenFeedback: {
        rating: 5,
        comment: 'Resolved super fast! Thank you municipal team.',
        submittedAt: new Date()
      },
      timeline: [
        { status: 'Submitted', updatedBy: citizen2.name, note: 'Complaint submitted' },
        { status: 'Assigned', updatedBy: 'System AI', note: 'Assigned to Water Works' },
        { status: 'In Progress', updatedBy: watDept.officer.name, note: 'Repair team on site.' },
        { status: 'Resolved', updatedBy: watDept.officer.name, note: 'Pipeline welded and sealed.' }
      ]
    });

    // 5. Notifications
    await Notification.create({
      userId: citizen1._id,
      title: 'Complaint Update',
      message: `Your complaint "${c1.title}" status changed to In Progress.`,
      type: 'info',
      link: `/citizen/complaint/${c1._id}`
    });

    console.log('[Seeder] Database seeding completed successfully!');
  } catch (err) {
    console.error('[Seeder Error]', err.message);
  }
};
