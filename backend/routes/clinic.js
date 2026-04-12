import express from 'express';
import { getClinicData, toggleSlot } from '../controllers/clinicController.js';
import { protect, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(requireRole('Vet Clinic'));

router.get('/data', getClinicData);
router.post('/slots/toggle', toggleSlot);

export default router;
