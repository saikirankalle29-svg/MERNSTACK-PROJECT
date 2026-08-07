import bcrypt from 'bcryptjs';

// Default mock in-memory database used when MongoDB service is not running locally
const salt = bcrypt.genSaltSync(10);
const defaultPasswordHash = bcrypt.hashSync('password123', salt);

export const memoryStore = {
  users: [
    {
      _id: 'usr_admin_01',
      name: 'System Admin',
      email: 'admin@civicroute.gov',
      password: defaultPasswordHash,
      phone: '+91 9876543210',
      address: 'City Municipal Headquarters',
      role: 'Admin',
      createdAt: new Date()
    },
    {
      _id: 'usr_off_san_01',
      name: 'Officer Rajesh Kumar',
      email: 'officer.sanitation@civicroute.gov',
      password: defaultPasswordHash,
      phone: '+91 9876543211',
      address: 'Municipal Officer Block B',
      role: 'Department Officer',
      department: 'dept_san_01',
      createdAt: new Date()
    },
    {
      _id: 'usr_off_ele_01',
      name: 'Officer Ananya Sharma',
      email: 'officer.electrical@civicroute.gov',
      password: defaultPasswordHash,
      phone: '+91 9876543212',
      address: 'Electrical Substation HQ',
      role: 'Department Officer',
      department: 'dept_ele_01',
      createdAt: new Date()
    },
    {
      _id: 'usr_cit_01',
      name: 'Rahul Verma',
      email: 'citizen@civicroute.com',
      password: defaultPasswordHash,
      phone: '+91 9123456789',
      address: 'Plot 42, Hitech City, Madhapur',
      role: 'Citizen',
      createdAt: new Date()
    }
  ],

  departments: [
    {
      _id: 'dept_san_01',
      departmentName: 'Sanitation',
      code: 'SAN',
      description: 'Handles waste management, street cleaning & garbage disposal',
      email: 'sanitation@civicroute.gov',
      officer: { _id: 'usr_off_san_01', name: 'Officer Rajesh Kumar', email: 'officer.sanitation@civicroute.gov' },
      active: true,
      createdAt: new Date()
    },
    {
      _id: 'dept_ele_01',
      departmentName: 'Electrical Department',
      code: 'ELE',
      description: 'Manages street lighting, power lines & electrical safety',
      email: 'electrical@civicroute.gov',
      officer: { _id: 'usr_off_ele_01', name: 'Officer Ananya Sharma', email: 'officer.electrical@civicroute.gov' },
      active: true,
      createdAt: new Date()
    },
    {
      _id: 'dept_wat_01',
      departmentName: 'Water Works Department',
      code: 'WAT',
      description: 'Handles water pipelines, supply quality & drainage overflow',
      email: 'water@civicroute.gov',
      officer: null,
      active: true,
      createdAt: new Date()
    }
  ],

  complaints: [
    {
      _id: 'cmp_1001',
      title: 'Garbage Dumped Near Bus Stop',
      description: 'There is uncollected garbage everywhere near our colony bus stop for over one week. It creates unhygienic conditions.',
      category: 'Garbage',
      departmentName: 'Sanitation',
      department: 'dept_san_01',
      priority: 'High',
      status: 'In Progress',
      location: 'Madhapur Bus Stop, Cyberabad',
      summary: 'Garbage accumulation for one week creating unhygienic conditions.',
      improvedComplaint: 'Garbage has remained uncollected in the residential bus stop area for the past week, creating unhygienic conditions.',
      citizenId: { _id: 'usr_cit_01', name: 'Rahul Verma', email: 'citizen@civicroute.com' },
      officerId: { _id: 'usr_off_san_01', name: 'Officer Rajesh Kumar', email: 'officer.sanitation@civicroute.gov' },
      timeline: [
        { status: 'Submitted', updatedBy: 'Rahul Verma', note: 'Complaint registered by citizen.', timestamp: new Date() },
        { status: 'Assigned', updatedBy: 'Groq AI Engine', note: 'Auto-routed to Sanitation.', timestamp: new Date() },
        { status: 'In Progress', updatedBy: 'Officer Rajesh Kumar', note: 'Cleanup crew dispatched.', timestamp: new Date() }
      ],
      remarks: [
        { author: 'Officer Rajesh Kumar', role: 'Department Officer', text: 'Sanitation truck assigned.', createdAt: new Date() }
      ],
      createdAt: new Date()
    },
    {
      _id: 'cmp_1002',
      title: 'Street Light Not Working',
      description: 'Street light near block 4 has not been working for 5 days. Road is dark at night.',
      category: 'Street Light',
      departmentName: 'Electrical Department',
      department: 'dept_ele_01',
      priority: 'Medium',
      status: 'Submitted',
      location: 'Main Road, Jubilee Hills Block 4',
      summary: 'Street light non-functional causing night visibility issues.',
      improvedComplaint: 'The street light pole near Block 4 bus stop has been non-functional for 5 consecutive days.',
      citizenId: { _id: 'usr_cit_01', name: 'Rahul Verma', email: 'citizen@civicroute.com' },
      officerId: { _id: 'usr_off_ele_01', name: 'Officer Ananya Sharma', email: 'officer.electrical@civicroute.gov' },
      timeline: [
        { status: 'Submitted', updatedBy: 'Rahul Verma', note: 'Complaint registered.', timestamp: new Date() }
      ],
      remarks: [],
      createdAt: new Date()
    }
  ],

  notifications: [
    {
      _id: 'notif_01',
      userId: 'usr_cit_01',
      title: 'Complaint Update',
      message: 'Your complaint "Garbage Dumped Near Bus Stop" status changed to In Progress.',
      type: 'info',
      read: false,
      createdAt: new Date()
    }
  ]
};
