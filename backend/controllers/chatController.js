import { Message } from '../models/Message.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';
import { emitUpdate } from '../utils/socket.js';

/**
 * Get chat history between two users
 */
export const getChatHistory = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: req.user.id, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: req.user.id }
      ]
    }).sort({ createdAt: 1 });

    return sendSuccess(res, { messages }, 'Chat history fetched');
  } catch (error) {
    return sendError(res, 'SERVER_ERROR', 'Failed to fetch messages');
  }
};

/**
 * Send a new Message
 */
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    
    const message = await Message.create({
      senderId: req.user.id,
      receiverId,
      content
    });

    // REAL-TIME BROADCAST to the receiver's private room
    emitUpdate(`user_${receiverId}`, 'new-message', {
      message,
      senderName: req.user.profile.name
    });

    return sendSuccess(res, { message }, 'Message sent successfully');
  } catch (error) {
    return sendError(res, 'SERVER_ERROR', 'Failed to send message');
  }
};
