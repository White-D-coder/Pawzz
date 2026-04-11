import { Booking } from '../models/Booking.js';
import { Listing } from '../models/Listing.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

/**
 * Handle Atomic Slot Booking
 * Uses findOneAndUpdate with filter-based validation to prevent race conditions
 */
export const createBooking = async (req, res) => {
  try {
    const { listingId, slotDate, slotTime } = req.body;
    const userId = req.user.id;

    // 1. Verify listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) return sendError(res, 'NOT_FOUND', 'Listing not found', 404);

    // 2. Atomic Reservation
    // We attempt to create the booking. The unique index in the Booking model 
    // [listingId + slotDate + slotTime] will automatically reject duplicates 
    // at the DB layer, preventing double-booking even under heavy load.
    
    const booking = await Booking.create({
      user: userId,
      listing: listingId,
      slotDate: new Date(slotDate),
      slotTime,
      status: 'confirmed' // Or 'pending' if payment is required
    });

    return sendSuccess(res, { booking }, 'Slot booked successfully!', 201);
  } catch (error) {
    if (error.code === 11000) {
      return sendError(res, 'CONFLICT', 'This slot is already booked. Please choose another.', 409);
    }
    console.error('❌ Booking Error:', error);
    return sendError(res, 'DB_ERROR', 'Failed to complete booking');
  }
};

/**
 * Get user's active bookings
 */
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('listing');
    return sendSuccess(res, { bookings }, 'Fetched active bookings');
  } catch (error) {
    return sendError(res, 'DB_ERROR', 'Failed to fetch bookings');
  }
};
