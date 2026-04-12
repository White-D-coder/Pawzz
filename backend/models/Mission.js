import mongoose from 'mongoose';

const missionSchema = new mongoose.Schema({
  ngoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  location: {
    address: String,
    city: String,
    coords: {
      type: { type: String, default: 'Point' },
      coordinates: [Number] // [lng, lat]
    }
  },
  volunteersAssigned: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

missionSchema.index({ 'location.coords': '2dsphere' });

export const Mission = mongoose.model('Mission', missionSchema);
