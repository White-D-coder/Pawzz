import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true }
});

export const GlobalSetting = mongoose.model('GlobalSetting', settingSchema);
