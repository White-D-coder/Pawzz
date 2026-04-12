import { Booking } from '../models/Booking.js';
import { Listing } from '../models/Listing.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

/**
 * Handle Atomic Slot Booking
 * Uses findOneAndUpdate with filter-based validation to prevent race conditions
 */
export const createBooking = async (req, res) => {
  try {
    const { listingId, slotDate, slotTime, petInfo } = req.body; // slotDate: YYYY-MM-DD
    const userId = req.user.id;

    // 1. Atomically verify slot availability within Listing
    const listing = await Listing.findOneAndUpdate(
      { 
        _id: listingId,
        "slots.date": slotDate,
        "slots.time": slotTime,
        "slots.isLocked": false,
        "slots.isBooked": false
      },
      { 
        $set: { "slots.$.isBooked": true }
      },
      { new: true }
    );

    if (!listing) {
      return sendError(res, 'CONFLICT', 'Slot is either locked, already booked, or does not exist for this date.', 409);
    }

    // 2. Create the Booking entry
    const booking = await Booking.create({
      petParent: userId,
      provider: listingId,
      date: slotDate,
      slotTime: slotTime,
      petInfo: petInfo || { name: 'Pet', type: 'Consultation' },
      status: 'confirmed'
    });

    return sendSuccess(res, { booking }, 'Slot booked successfully!', 201);
  } catch (error) {
    console.error('❌ Booking Error:', error);
    return sendError(res, 'DB_ERROR', 'Failed to complete booking');
  }
};

/**
 * Get user's active bookings
 */
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).populate('providerId');
    return sendSuccess(res, { bookings }, 'Fetched active bookings');
  } catch (error) {
    console.error('❌ Fetch Bookings Error:', error);
    return sendError(res, 'DB_ERROR', 'Failed to fetch bookings');
  }
};
