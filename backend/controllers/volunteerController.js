import { Worker } from 'worker_threads';
import path from 'path';
import { fileURLToPath } from 'url';
import { VolunteerSubmission } from '../models/VolunteerSubmission.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Handle Volunteer Audio Submission
 * 1. Saves metadata to DB
 * 2. Offloads transcription to Worker Thread
 */
export const submitVolunteerAudio = async (req, res) => {
  try {
    const { title } = req.body;
    const file = req.file;

    if (!file) {
      return sendError(res, 'MISSING_FILE', 'Audio file is required', 400);
    }

    // 1. Create Submission Record
    const submission = await VolunteerSubmission.create({
      user: req.user.id,
      title,
      audioFileId: file.id, // ID from GridFS
      status: 'processing'
    });

    // 2. Offload Transcription to Worker Thread
    const workerPath = path.resolve(__dirname, '../utils/transcriptionWorker.js');
    const worker = new Worker(workerPath, {
      workerData: { audioId: file.id }
    });

    worker.on('message', async (result) => {
      if (result.success) {
        await VolunteerSubmission.findByIdAndUpdate(submission._id, {
          transcription: result.transcription,
          status: 'completed'
        });
        console.log(`✅ Transcription completed for submission ${submission._id}`);
      }
    });

    worker.on('error', (err) => console.error('❌ Worker Error:', err));

    return sendSuccess(res, { submissionId: submission._id }, 'Submission uploaded and processing started', 202);
  } catch (error) {
    console.error('❌ Volunteer Submission Error:', error);
    return sendError(res, 'SERVER_ERROR', 'Failed to process submission');
  }
};

/**
 * Get volunteer's submissions
 */
export const getMySubmissions = async (req, res) => {
  try {
    const submissions = await VolunteerSubmission.find({ user: req.user.id });
    return sendSuccess(res, { submissions }, 'Fetched volunteer submissions');
  } catch (error) {
    return sendError(res, 'DB_ERROR', 'Failed to fetch submissions');
  }
};
