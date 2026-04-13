import express from 'express';
import { googleLogin, logout } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', googleLogin);
router.post('/logout', logout);

router.get('/me', protect, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;
