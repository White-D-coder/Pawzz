import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  providerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Listing', 
    required: true 
  },
  time_slot: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled'], 
    default: 'pending' 
  },
  payment_ref: String
}, { timestamps: true });

// Compound index for atomic concurrency checks
bookingSchema.index({ providerId: 1, time_slot: 1 }, { unique: true });

export const Booking = mongoose.model('Booking', bookingSchema);
