import { Listing } from '../models/Listing.js';
import { User } from '../models/User.js';
import { Booking } from '../models/Booking.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

/**
 * Get Clinic's own listing and bookings
 */
export const getClinicData = async (req, res) => {
  try {
    const fullUser = await User.findById(req.user.id);
    let listing = await Listing.findOne({ ownerId: req.user.id });
    
    // Auto-create if missing
    if (!listing) {
      listing = await Listing.create({
        ownerId: req.user.id,
        type: 'clinic',
        name: `Dr. ${fullUser?.profile?.name || 'Veterinary'}'s Clinic`,
        location: { city: 'Mumbai', address: 'Update Required', coords: { type: 'Point', coordinates: [72.87, 19.07] } },
        verification_status: 'approved',
        slots: []
      });
    }

    const bookings = await Booking.find({ provider: listing._id })
      .populate('petParent', 'profile email')
      .sort({ createdAt: -1 });

    return sendSuccess(res, { listing, bookings }, 'Clinic data fetched');
  } catch (error) {
    return sendError(res, 'SERVER_ERROR', error.message);
  }
};

/**
 * Toggle Slot Lock Status
 */
export const toggleSlot = async (req, res) => {
  try {
    const { slotTime } = req.body;
    let listing = await Listing.findOne({ ownerId: req.user.id });
    
    if (!listing) {
       // Should be handled by getClinicData first, but for safety:
       return sendError(res, 'NOT_FOUND', 'Clinic not yet initialized. Please refresh.', 404);
    }

    // Find slot or create if doesn't exist (Dynamic slots)
    let slot = listing.slots.find(s => s.time === slotTime);
    
    if (slot) {
      slot.isLocked = !slot.isLocked;
    } else {
      listing.slots.push({ time: slotTime, isLocked: true });
    }

    await listing.save();
    return sendSuccess(res, { listing }, `Slot ${slotTime} toggled`);
  } catch (error) {
    return sendError(res, 'SERVER_ERROR', error.message);
  }
};
