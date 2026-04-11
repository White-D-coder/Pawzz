import { VolunteerSubmission } from '../models/VolunteerSubmission.js';
import { Listing } from '../models/Listing.js';
import { responseHelper } from '../utils/responseHelper.js';

export const getVolunteers = async (req, res, next) => {
  try {
    const submissions = await VolunteerSubmission.find({}).sort({ createdAt: -1 }).lean();
    return responseHelper.success(res, 200, { submissions }, "Fetched volunteer submissions");
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
      return responseHelper.error(res, 404, "NOT_FOUND", "Submission not found");
    }
    
    return responseHelper.success(res, 200, { submission: updated }, "Status updated");
  } catch (error) {
    next(error);
  }
};

export const getPendingListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ verification_status: 'pending' }).sort({ createdAt: -1 }).lean();
    return responseHelper.success(res, 200, { listings }, "Fetched pending listings");
  } catch (error) {
    next(error);
  }
};

export const approveListing = async (req, res, next) => {
  try {
    const { listingId, status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return responseHelper.error(res, 400, "BAD_REQUEST", "Status must be approved or rejected");
    }

    const updated = await Listing.findByIdAndUpdate(listingId, { verification_status: status }, { new: true });
    if (!updated) {
      return responseHelper.error(res, 404, "NOT_FOUND", "Listing not found");
    }
    
    return responseHelper.success(res, 200, { listing: updated }, "Listing verification status updated");
  } catch (error) {
    next(error);
  }
};
