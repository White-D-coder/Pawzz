import { AdminWhitelist } from '../models/AdminWhitelist.js';
import { User } from '../models/User.js';
import { VolunteerSubmission } from '../models/VolunteerSubmission.js';
import { Listing } from '../models/Listing.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';
import { emitUpdate } from '../utils/socket.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 }).lean();
    return sendSuccess(res, { users }, "Fetched all users");
  } catch (error) {
    next(error);
  }
};

export const getPendingUsers = async (req, res, next) => {
  try {
    const users = await User.find({ requestedRole: { $ne: null }, isApproved: false }).sort({ createdAt: -1 }).lean();
    return sendSuccess(res, { users }, "Fetched pending user approvals");
  } catch (error) {
    next(error);
  }
};

export const approveUser = async (req, res, next) => {
  try {
    const { userId, approve } = req.body;
    
    if (approve) {
      const user = await User.findById(userId);
      if (!user) return sendError(res, "NOT_FOUND", "User not found", 404);
      
      const oldRole = user.role;
      user.role = user.requestedRole;
      user.isApproved = true;
      user.requestedRole = null;
      await user.save();
      
      // REAL-TIME BROADCAST
      emitUpdate(`user_${userId}`, 'role-updated', { role: user.role, isApproved: true });
      emitUpdate(null, 'new-user-approved', { role: user.role, id: userId });

      return sendSuccess(res, { user }, `User approved as ${user.role}`);
    } else {
      // Reject
      await User.findByIdAndUpdate(userId, { requestedRole: null, isApproved: true }); // Stays as Pet Parent
      return sendSuccess(res, null, "User request rejected");
    }
  } catch (error) {
    next(error);
  }
};

export const getVolunteers = async (req, res, next) => {
  try {
    const submissions = await VolunteerSubmission.find({}).sort({ createdAt: -1 }).lean();
    return sendSuccess(res, { submissions }, "Fetched volunteer submissions");
  } catch (error) {
    next(error);
  }
};

export const updateVolunteerStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await VolunteerSubmission.findByIdAndUpdate(id, { status }, { new: true });
    
    if (!updated) {
      return sendError(res, "NOT_FOUND", "Submission not found", 404);
    }
    
    return sendSuccess(res, { submission: updated }, "Status updated");
  } catch (error) {
    next(error);
  }
};

export const getPendingListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ verification_status: 'pending' }).sort({ createdAt: -1 }).lean();
    return sendSuccess(res, { listings }, "Fetched pending listings");
  } catch (error) {
    next(error);
  }
};

export const approveListing = async (req, res, next) => {
  try {
    const { listingId, status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return sendError(res, "BAD_REQUEST", "Status must be approved or rejected", 400);
    }

    const updated = await Listing.findByIdAndUpdate(listingId, { verification_status: status }, { new: true });
    if (!updated) {
      return sendError(res, "NOT_FOUND", "Listing not found", 404);
    }
    
    return sendSuccess(res, { listing: updated }, "Listing verification status updated");
  } catch (error) {
    next(error);
  }
};

import { Booking } from '../models/Booking.js';
import { GlobalSetting } from '../models/GlobalSetting.js';

export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({}).populate('userId', 'email profile.name').populate('providerId', 'title type location').sort({ time_slot: 1 }).lean();
    return sendSuccess(res, { bookings }, "Fetched all bookings");
  } catch (error) {
    next(error);
  }
};

export const getSettings = async (req, res, next) => {
  try {
    let settings = await GlobalSetting.findOne({ key: 'booking_slots' });
    if (!settings) {
      settings = await GlobalSetting.create({ 
        key: 'booking_slots', 
        value: { 
          timeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
          activeDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        }
      });
    }
    return sendSuccess(res, { settings: settings.value }, "Settings fetched");
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const { timeSlots } = req.body;
    const settings = await GlobalSetting.findOneAndUpdate(
      { key: 'booking_slots' },
      { $set: { 'value.timeSlots': timeSlots } },
      { new: true, upsert: true }
    );
    return sendSuccess(res, { settings: settings.value }, "Settings updated");
  } catch (error) {
    next(error);
  }
};
