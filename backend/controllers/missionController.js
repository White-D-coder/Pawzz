import { Mission } from '../models/Mission.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';
import { emitUpdate } from '../utils/socket.js';

/**
 * Get all missions for the logged-in NGO
 */
export const getNGOMissions = async (req, res) => {
  try {
    const missions = await Mission.find({ ngoId: req.user.id }).sort({ createdAt: -1 });
    return sendSuccess(res, { missions }, 'Missions fetched successfully');
  } catch (error) {
    return sendError(res, 'SERVER_ERROR', 'Failed to fetch missions');
  }
};

/**
 * Launch a new Rescue Mission
 */
export const createMission = async (req, res) => {
  try {
    const { title, description, priority, location } = req.body;
    
    const mission = await Mission.create({
      ngoId: req.user.id,
      title,
      description,
      priority,
      location
    });

    // Real-time notification to volunteers room
    emitUpdate('volunteers', 'new-mission', mission);

    return sendSuccess(res, { mission }, 'Rescue mission launched successfully');
  } catch (error) {
    return sendError(res, 'SERVER_ERROR', 'Failed to create mission');
  }
};

/**
 * Update Mission Status
 */
export const updateMissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const mission = await Mission.findOneAndUpdate(
      { _id: id, ngoId: req.user.id },
      { status },
      { new: true }
    );

    if (!mission) return sendError(res, 'NOT_FOUND', 'Mission not found', 404);

    return sendSuccess(res, { mission }, `Mission marked as ${status}`);
  } catch (error) {
    return sendError(res, 'SERVER_ERROR', 'Failed to update mission');
  }
};
