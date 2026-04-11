import { getListings, createListing, verifyListing } from '../controllers/listingController.js';
import { protect, requireRole } from '../middlewares/authMiddleware.js';
import { validate, listingSchema } from '../validators/schemas.js';

const router = express.Router();

/**
 * Public Routes - Search
 */
router.get('/', getListings);

/**
 * Protected Routes - Clinic/NGO
 */
router.post('/', protect, requireRole('Vet Clinic', 'NGO'), validate(listingSchema), createListing);

/**
 * Admin Routes - Approval Workflow
 */
router.patch('/verify/:listingId', protect, requireRole('Admin'), verifyListing);

export default router;

