import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  ownerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  type: { 
    type: String, 
    enum: ['clinic', 'ngo', 'service'], 
    required: true 
  },
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  location: {
    address: String,
    city: String,
    coords: {
      type: { type: String, default: 'Point' },
      coordinates: [Number] // [longitude, latitude]
    }
  },
  services: [String],
  phone: String,
  email: String,
  verification_status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  }
}, { timestamps: true });

// Indexes as per specs
listingSchema.index({ verification_status: 1 });
listingSchema.index({ type: 1 });
listingSchema.index({ 'location.coords': '2dsphere' }); // For geospatial queries

export const Listing = mongoose.model('Listing', listingSchema);
