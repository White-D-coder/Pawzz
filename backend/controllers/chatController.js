import { Message } from '../models/Message.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';
import { emitUpdate } from '../utils/socket.js';
import { getChatbotResponse } from '../services/chatbotService.js';

const CHATBOT_ID = '000000000000000000000001'; // Reserved ID for AI Chatbot

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
    
    // 1. Save User's Message
    const userMessage = await Message.create({
      senderId: req.user.id,
      receiverId,
      content
    });

    // 2. If the receiver is the AI Chatbot, generate a response
    if (receiverId === CHATBOT_ID) {
      // Get last few messages for context
      const history = await Message.find({
        $or: [
          { senderId: req.user.id, receiverId: CHATBOT_ID },
          { senderId: CHATBOT_ID, receiverId: req.user.id }
        ]
      })
      .sort({ createdAt: -1 })
      .limit(5);

      const chatbotReply = await getChatbotResponse(content, history.reverse());

      // Save AI's Message
      const aiMessage = await Message.create({
        senderId: CHATBOT_ID,
        receiverId: req.user.id,
        content: chatbotReply
      });

      // Emit to user's private room so they see the reply in real-time
      emitUpdate(`user_${req.user.id}`, 'new-message', {
        message: aiMessage,
        senderName: 'PAWZZ Assistant'
      });

      return sendSuccess(res, { message: userMessage, reply: aiMessage }, 'Message sent and processed by AI');
    }

    // 3. Normal peer-to-peer REAL-TIME BROADCAST
    emitUpdate(`user_${receiverId}`, 'new-message', {
      message: userMessage,
      senderName: req.user.profile.name
    });

    return sendSuccess(res, { message: userMessage }, 'Message sent successfully');
  } catch (error) {
    console.error('Chat sendMessage Error:', error);
    return sendError(res, 'SERVER_ERROR', 'Failed to send message');
  }
};
