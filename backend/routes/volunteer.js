import express from 'express';
import { submitVolunteerAudio, getMySubmissions } from '../controllers/volunteerController.js';
import { protect, requireRole } from '../middlewares/authMiddleware.js';
import { upload } from '../utils/upload.js';

const router = express.Router();

/**
 * Volunteer Submissions - Restricted to 'Volunteer / City Lead'
 */
router.post(
  '/submit', 
  protect, 
  upload.single('audio'), 
  submitVolunteerAudio
);

router.get(
  '/my', 
  protect, 
  requireRole('Volunteer / City Lead'), 
  getMySubmissions
);

export default router;
