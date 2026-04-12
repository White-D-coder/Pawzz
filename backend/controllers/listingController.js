import { Listing } from '../models/Listing.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

/**
 * Get all listings with optional filtering & geo-search
 */
export const getListings = async (req, res) => {
  try {
    const { type, verified, lat, lng, radius = 5000, search, sortby } = req.query;
    let query = {};

    // Basic Filters
    if (type) query.type = type.toLowerCase();
    if (verified) query.verification_status = verified === 'true' ? 'approved' : 'pending';

    // Text Search over name or city
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { "location.city": { $regex: search, $options: 'i' } },
        { services: { $regex: search, $options: 'i' } }
      ];
    }

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

    // Sorting logic
    let sortConfig = { createdAt: -1 }; // Default
    if (sortby === 'price_asc') sortConfig = { price: 1 };
    if (sortby === 'price_desc') sortConfig = { price: -1 };
    if (sortby === 'rating') sortConfig = { "telemetry.rating": -1 };

    const listings = await Listing.find(query).sort(sortConfig);
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

/**
 * Temporary: Seed Listings
 */
export const seedListings = async (req, res) => {
  try {
    const ownerId = "67098e9b6a09880012345678"; // Dummy ID
    const sampleListings = [
      { ownerId, type: 'clinic', name: 'Blue Cross Animal Hospital', location: { address: 'Colaba', city: 'Mumbai', coords: { type: 'Point', coordinates: [72.82, 18.92] } }, services: ['Surgery', 'Vaccination'], price: 500, imageUrl: '/image/1.jpeg', telemetry: { rating: 4.8, reviews_count: 120, years_experience: 12 } },
      { ownerId, type: 'clinic', name: 'Pawfect Health Center', location: { address: 'Bandra', city: 'Mumbai', coords: { type: 'Point', coordinates: [72.83, 19.05] } }, services: ['Grooming'], price: 400, imageUrl: '/image/Dog.jpeg', telemetry: { rating: 4.5, reviews_count: 85, years_experience: 8 } },
      { ownerId, type: 'ngo', name: 'Save A Life Shelter', location: { address: 'Andheri', city: 'Mumbai', coords: { type: 'Point', coordinates: [72.86, 19.11] } }, services: ['Rescue'], price: 0, imageUrl: '/image/Dog.jpeg', telemetry: { rating: 4.9, reviews_count: 240, years_experience: 15 } },
      { ownerId, type: 'clinic', name: 'Happy Paws Vet', location: { address: 'Salt Lake', city: 'Kolkata', coords: { type: 'Point', coordinates: [88.43, 22.57] } }, services: ['Internal Medicine'], price: 600, imageUrl: '/image/1.jpeg', telemetry: { rating: 4.2, reviews_count: 45, years_experience: 6 } },
      { ownerId, type: 'ngo', name: 'Kolkata Animal Rescue', location: { address: 'New Town', city: 'Kolkata', coords: { type: 'Point', coordinates: [88.46, 22.58] } }, services: ['Ambulance'], price: 0, imageUrl: '/image/thumb.jpeg', telemetry: { rating: 4.7, reviews_count: 150, years_experience: 10 } },
      { ownerId, type: 'clinic', name: 'Vets For Pets', location: { address: 'Indiranagar', city: 'Bangalore', coords: { type: 'Point', coordinates: [77.64, 12.97] } }, services: ['Laboratory'], price: 750, imageUrl: '/image/1.jpeg', telemetry: { rating: 4.6, reviews_count: 92, years_experience: 9 } },
      { ownerId, type: 'ngo', name: 'Compassion Trust', location: { address: 'Koramangala', city: 'Bangalore', coords: { type: 'Point', coordinates: [77.62, 12.93] } }, services: ['Education'], price: 0, imageUrl: '/image/Dog.jpeg', telemetry: { rating: 4.4, reviews_count: 67, years_experience: 5 } },
      { ownerId, type: 'clinic', name: 'Pet Healing Clinic', location: { address: 'Sector 45', city: 'Gurgaon', coords: { type: 'Point', coordinates: [77.06, 28.45] } }, services: ['Cardiology'], price: 900, imageUrl: '/image/1.jpeg', telemetry: { rating: 4.3, reviews_count: 38, years_experience: 14 } },
      { ownerId, type: 'ngo', name: 'Friendicos', location: { address: 'Defence Colony', city: 'Delhi', coords: { type: 'Point', coordinates: [77.23, 28.57] } }, services: ['Spay/Neuter'], price: 0, imageUrl: '/image/thumb.jpeg', telemetry: { rating: 5.0, reviews_count: 1200, years_experience: 40 } },
      { ownerId, type: 'clinic', name: 'Advance Pet Care', location: { address: 'Banjara Hills', city: 'Hyderabad', coords: { type: 'Point', coordinates: [78.43, 17.41] } }, services: ['Microchipping'], price: 450, imageUrl: '/image/ami.jpeg', telemetry: { rating: 4.1, reviews_count: 55, years_experience: 7 } },
      { ownerId, type: 'clinic', name: 'City Animal Care', location: { address: 'Gachibowli', city: 'Hyderabad', coords: { type: 'Point', coordinates: [78.34, 17.44] } }, services: ['Vaccination'], price: 350, imageUrl: '/image/1.jpeg', telemetry: { rating: 4.4, reviews_count: 72, years_experience: 11 } }
    ];

    await Listing.deleteMany({});
    await Listing.insertMany(sampleListings);
    
    return sendSuccess(res, null, 'Listings seeded successfully');
  } catch (error) {
    return sendError(res, 'SERVER_ERROR', 'Seeding failed');
  }
};
;

