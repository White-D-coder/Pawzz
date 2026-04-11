import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['clinic', 'ngo', 'service'], 
    required: true 
  },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
    address: String,
    city: String
  },
  services: [String],
  verification_status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  details: {
    name: { type: String, required: true },
    description: String,
    phone: String,
    email: String
  }
}, { timestamps: true });

listingSchema.index({ location: '2dsphere' });

export const Listing = mongoose.model('Listing', listingSchema);
