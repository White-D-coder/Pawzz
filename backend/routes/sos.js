import express from 'express';
import { raiseSOS } from '../controllers/sosController.js';
import { protect, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);
// Only approved Professionals/NGOs can raise SOS
router.use(requireRole('Vet Clinic', 'NGO', 'Admin'));

router.post('/trigger', raiseSOS);

export default router;
