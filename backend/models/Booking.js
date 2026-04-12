import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  petParent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  slotTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'confirmed'
  },
  petInfo: {
    name: String,
    type: String,
    note: String
  }
}, { timestamps: true });

export const Booking = mongoose.model('Booking', bookingSchema);
