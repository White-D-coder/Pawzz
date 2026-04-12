import { emitUpdate } from '../utils/socket.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';
import { VolunteerSubmission } from '../models/VolunteerSubmission.js';

/**
 * Trigger SOS Alert
 * Broadcasts an emergency signal to all nearby volunteers
 */
export const raiseSOS = async (req, res) => {
  try {
    const { type, message, location } = req.body;
    
    // 1. Log the SOS (Optional: Could store in a new SOS collection)
    console.log(`🚨 SOS RAISED: ${type} at ${location.coordinates}`);

    // 2. Real-time BROADCAST using Socket.io
    // Note: In production we'd use geospatial querying to find 'nearby' volunteers
    // For now, we broadcast to 'volunteers' room
    emitUpdate('volunteers', 'emergency-ping', {
      type,
      message,
      location,
      raisedBy: req.user.profile.name,
      timestamp: new Date()
    });

    return sendSuccess(res, null, 'SOS Alert broadcasted to nearby volunteers');
  } catch (error) {
    return sendError(res, 'SOS_ERROR', 'Failed to trigger alert');
  }
};
