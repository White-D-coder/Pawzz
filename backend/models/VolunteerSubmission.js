import mongoose from 'mongoose';

const volunteerSubmissionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  formData: {
    fullName: String,
    email: String,
    areaOfInterest: String
  },
  audio_url: { 
    type: String, 
    required: true 
  }, // GridFS file ObjectId as string
  transcript: { 
    type: String, 
    default: null 
  },
  status: { 
    type: String, 
    enum: ['pending review', 'accepted', 'rejected'], 
    default: 'pending review' 
  },
  processingError: { 
    type: String, 
    default: null 
  }
}, { timestamps: true });

export const VolunteerSubmission = mongoose.model('VolunteerSubmission', volunteerSubmissionSchema);
