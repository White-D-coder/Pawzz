import { Listing } from '../models/Listing.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

/**
 * Get all listings with optional filtering & geo-search
 */
export const getListings = async (req, res) => {
  try {
    const { type, verified, lat, lng, radius = 5000 } = req.query;
    let query = {};

    // Basic Filters
    if (type) query.type = type;
    if (verified) query.verified = verified === 'true';

    // Geo-spatial Search (if coordinates provided)
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      };
    }

    const listings = await Listing.find(query).sort('-createdAt');
    return sendSuccess(res, { listings }, `Fetched ${listings.length} listings successfully`);
  } catch (error) {
    console.error('❌ Get Listings Error:', error);
    return sendError(res, 'DB_ERROR', 'Failed to retrieve listings');
  }
};

/**
 * Create a new listing (Clinic/NGO only)
 */
export const createListing = async (req, res) => {
  try {
    const listing = await Listing.create({
      ...req.body,
      owner: req.user.id,
      verified: false // Mandatory human-review required
    });
    return sendSuccess(res, { listing }, 'Listing submitted for review!', 201);
  } catch (error) {
    return sendError(res, 'VALIDATION_ERROR', error.message, 400);
  }
};

/**
 * Admin Action: Verify or Disable Listing
 */
export const verifyListing = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { verified } = req.body;

    const listing = await Listing.findByIdAndUpdate(
      listingId,
      { verified },
      { new: true }
    );

    if (!listing) return sendError(res, 'NOT_FOUND', 'Listing not found', 404);

    return sendSuccess(res, { listing }, `Listing ${verified ? 'verified' : 'unverified'} successfully`);
  } catch (error) {
    return sendError(res, 'DB_ERROR', 'Action failed');
  }
};

