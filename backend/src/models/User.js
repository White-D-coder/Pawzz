import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  role: { 
    type: String, 
    enum: ['Vet Clinic', 'NGO', 'Service Provider', 'Volunteer / City Lead', 'Admin'], 
    default: 'Volunteer / City Lead'
  },
  profile: {
    name: String,
    phone: String,
    avatar: String
  }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
