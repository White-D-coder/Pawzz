import mongoose from 'mongoose';

const adminWhitelistSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  note: String
}, { timestamps: true });

export const AdminWhitelist = mongoose.model('AdminWhitelist', adminWhitelistSchema);
