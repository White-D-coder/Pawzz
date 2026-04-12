import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  role: { 
    type: String, 
    enum: ['Pet Parent', 'Vet Clinic', 'NGO', 'Service Provider', 'Volunteer / City Lead', 'Admin'], 
    required: true,
    default: 'Pet Parent'
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'rejected', 'suspended'],
    default: 'pending'
  },
  requestedRole: {
    type: String,
    enum: ['Pet Parent', 'Vet Clinic', 'NGO', 'Service Provider', 'Volunteer / City Lead', 'Admin'],
  },
  profile: {
    name: String,
    phone: String,
    avatar: String
  },
  volunteer_stats: {
    active_rescues: { type: Number, default: 0 },
    hours_logged: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Indexes for performance as per specs
userSchema.index({ role: 1 });

export const User = mongoose.model('User', userSchema);

