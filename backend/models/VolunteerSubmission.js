import mongoose from 'mongoose';

const volunteerSubmissionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: String,
  formData: {
    fullName: String,
    email: String,
    areaOfInterest: String,
    city: String
  },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number] // [longitude, latitude]
  },
  isCityLead: { type: Boolean, default: false },
  audioFileId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  }, // GridFS file ObjectId
  transcript: { 
    type: String, 
    default: null 
  },
  status: { 
    type: String, 
    enum: ['processing', 'completed', 'pending review', 'accepted', 'rejected'], 
    default: 'processing' 
  },
  processingError: { 
    type: String, 
    default: null 
  }
}, { timestamps: true });

export const VolunteerSubmission = mongoose.model('VolunteerSubmission', volunteerSubmissionSchema);
