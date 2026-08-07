import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    departmentName: {
      type: String,
      required: [true, 'Department name is required'],
      unique: true,
      trim: true
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    officer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    email: {
      type: String,
      default: ''
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Department = mongoose.model('Department', departmentSchema);
export default Department;
