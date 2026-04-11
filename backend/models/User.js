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
    enum: ['Vet Clinic', 'NGO', 'Service Provider', 'Volunteer / City Lead', 'Admin'], 
    required: true,
    default: 'Volunteer / City Lead'
  },
  profile: {
    name: String,
    phone: String,
    avatar: String
  }
}, { timestamps: true });

// Indexes for performance as per specs
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

export const User = mongoose.model('User', userSchema);
