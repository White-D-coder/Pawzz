import express from 'express';
import { 
  getVolunteers, updateVolunteerStatus, getPendingListings, approveListing, 
  getAllBookings, updateSettings, getPendingUsers, approveUser, getAllUsers 
} from '../controllers/adminController.js';
import { protect, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(requireRole('Admin'));

router.get('/users', getAllUsers);
router.get('/volunteers', getVolunteers);
router.patch('/volunteers/:id', updateVolunteerStatus);
router.get('/listings/pending', getPendingListings);
router.patch('/approve', approveListing);

router.get('/users/pending', getPendingUsers);
router.patch('/users/approve', approveUser);

router.get('/bookings', getAllBookings);
router.patch('/settings', updateSettings);

export default router;
