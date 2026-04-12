import express from 'express';
import { getNGOMissions, createMission, updateMissionStatus } from '../controllers/missionController.js';
import { protect, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(requireRole('NGO', 'Admin'));

router.get('/', getNGOMissions);
router.post('/', createMission);
router.patch('/:id/status', updateMissionStatus);

export default router;
