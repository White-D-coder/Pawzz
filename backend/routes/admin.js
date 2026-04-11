import express from 'express';
import { getVolunteers, updateVolunteerStatus, getPendingListings, approveListing } from '../controllers/adminController.js';
import { protect, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(requireRole(['Admin']));

router.get('/volunteers', getVolunteers);
router.patch('/volunteers/:id', updateVolunteerStatus);
router.get('/listings/pending', getPendingListings);
router.patch('/approve', approveListing);

export default router;
