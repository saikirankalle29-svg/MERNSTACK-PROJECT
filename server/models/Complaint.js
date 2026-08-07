import mongoose from 'mongoose';

const remarkSchema = new mongoose.Schema({
  author: { type: String, required: true },
  role: { type: String, required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const timelineSchema = new mongoose.Schema({
  status: { type: String, required: true },
  updatedBy: { type: String, required: true },
  note: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now }
});

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Road',
        'Drainage',
        'Garbage',
        'Street Light',
        'Water Supply',
        'Electricity',
        'Traffic',
        'Public Property',
        'Other'
      ],
      default: 'Other'
    },
    departmentName: {
      type: String,
      default: 'General Civics'
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      default: null
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium'
    },
    status: {
      type: String,
      enum: ['Submitted', 'Assigned', 'In Progress', 'Resolved', 'Rejected', 'Closed'],
      default: 'Submitted'
    },
    location: {
      type: String,
      required: [true, 'Location is required']
    },
    image: {
      type: String,
      default: ''
    },
    resolutionImage: {
      type: String,
      default: ''
    },
    summary: {
      type: String,
      default: ''
    },
    improvedComplaint: {
      type: String,
      default: ''
    },
    citizenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    officerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    citizenFeedback: {
      rating: { type: Number, min: 1, max: 5, default: null },
      comment: { type: String, default: '' },
      submittedAt: { type: Date, default: null }
    },
    remarks: [remarkSchema],
    timeline: [timelineSchema]
  },
  {
    timestamps: true
  }
);

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
