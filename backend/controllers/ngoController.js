import { Listing } from '../models/Listing.js';
import { User } from '../models/User.js';
import { VolunteerSubmission } from '../models/VolunteerSubmission.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

/**
 * Get NGO Dynamic Dashboard Data
 */
export const getNGOData = async (req, res) => {
  try {
    const fullUser = await User.findById(req.user.id);
    const listing = await Listing.findOne({ ownerId: req.user.id, type: 'ngo' });
    
    // Auto-create if missing
    let finalListing = listing;
    if (!listing) {
      finalListing = await Listing.create({
        ownerId: req.user.id,
        type: 'ngo',
        name: `${fullUser?.profile?.name || 'Social'}'s Rescue Foundation`,
        location: { city: 'Mumbai', address: 'Main Shelter', coords: { type: 'Point', coordinates: [72.87, 19.07] } },
        verification_status: 'approved'
      });
    }

    // Dynamic Stats
    const totalRescues = finalListing.telemetry?.total_bookings || 0;
    const activeVolunteers = await VolunteerSubmission.countDocuments({ status: 'accepted' });

    return sendSuccess(res, { 
      listing: finalListing, 
      stats: {
        totalRescues,
        activeVolunteers,
        shelterCapacity: "85%",
        fundingGoal: "65%"
      }
    }, 'NGO data fetched');
  } catch (error) {
    return sendError(res, 'SERVER_ERROR', error.message);
  }
};
