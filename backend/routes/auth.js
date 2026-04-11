import express from 'express';
import { googleLogin, logout } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', googleLogin);
router.post('/logout', logout);

// Protected "me" route to check auth status on frontend mount
router.get('/me', protect, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;
