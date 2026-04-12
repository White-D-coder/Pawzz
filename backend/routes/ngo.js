import express from 'express';
import { getNGOData } from '../controllers/ngoController.js';
import { protect, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(requireRole('NGO'));

router.get('/data', getNGOData);

export default router;
