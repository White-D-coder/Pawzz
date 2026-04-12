import { Listing } from '../models/Listing.js';
import { VolunteerSubmission } from '../models/VolunteerSubmission.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

export const getMapData = async (req, res) => {
  try {
    // Fetch all approved listings with location data
    const listings = await Listing.find({ 
      verification_status: 'approved',
      'location.coords.coordinates': { $exists: true, $ne: [] }
    }).select('name type location imageUrl telemetry price').lean();

    // Fetch all accepted volunteers with location data
    const volunteers = await VolunteerSubmission.find({
      status: 'accepted',
      'location.coordinates': { $exists: true, $ne: [] }
    }).select('formData location isCityLead').lean();

    return sendSuccess(res, { listings, volunteers }, 'Map data fetched successfully');
  } catch (error) {
    console.error('❌ Map Data Error:', error);
    return sendError(res, 'DB_ERROR', 'Failed to fetch map data');
  }
};
