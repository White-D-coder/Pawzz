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
    // Extract date and time to create a single time_slot Date object
    const [hours, minutes] = slotTime.split(':');
    const timeSlotDate = new Date(slotDate);
    timeSlotDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const booking = await Booking.create({
      userId: userId,
      providerId: listingId,
      time_slot: timeSlotDate,
      status: 'confirmed'
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
    const bookings = await Booking.find({ userId: req.user.id }).populate('providerId');
    return sendSuccess(res, { bookings }, 'Fetched active bookings');
  } catch (error) {
    console.error('❌ Fetch Bookings Error:', error);
    return sendError(res, 'DB_ERROR', 'Failed to fetch bookings');
  }
};
