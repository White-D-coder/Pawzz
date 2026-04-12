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
  price: { type: Number, default: 0 },
  imageUrl: { type: String, default: 'https://images.unsplash.com/photo-1596731221715-db14bbdaac62' },
  description: { type: String, default: '' },
  phone: String,
  email: String,
  telemetry: {
    rating: { type: Number, default: 0 },
    reviews_count: { type: Number, default: 0 },
    total_bookings: { type: Number, default: 0 },
    years_experience: { type: Number, default: 5 },
  },
  verification_status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  slots: [{
    date: { type: String, required: true }, // YYYY-MM-DD
    time: String, // e.g. "09:00 AM"
    isLocked: { type: Boolean, default: true }, // Default Locked for production safety
    isBooked: { type: Boolean, default: false },
    currentBooking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }
  }]
}, { timestamps: true });

// Indexes as per specs
listingSchema.index({ verification_status: 1 });
listingSchema.index({ type: 1 });
listingSchema.index({ 'location.coords': '2dsphere' }); // For geospatial queries

export const Listing = mongoose.model('Listing', listingSchema);
