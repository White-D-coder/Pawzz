import { VolunteerSubmission } from '../models/VolunteerSubmission.js';
import { Listing } from '../models/Listing.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

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
