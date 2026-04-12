import express from 'express';
import { getChatHistory, sendMessage } from '../controllers/chatController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/:otherUserId', getChatHistory);
router.post('/', sendMessage);

export default router;
