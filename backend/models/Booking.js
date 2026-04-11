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
    enum: ['available', 'pending', 'confirmed', 'cancelled'], 
    default: 'available' 
  },
  paymentRef: { 
    type: String, 
    default: null 
  }
}, { timestamps: true });

// CRITICAL: Compound index for atomic concurrency as per technical-architect.md
bookingSchema.index({ providerId: 1, time_slot: 1, status: 1 });

export const Booking = mongoose.model('Booking', bookingSchema);
