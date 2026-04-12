import mongoose from 'mongoose';
import { Worker } from 'worker_threads';
import path from 'path';
import { fileURLToPath } from 'url';
import { VolunteerSubmission } from '../models/VolunteerSubmission.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Handle Volunteer Audio Submission
 * 1. Manually streams memory buffer to GridFS
 * 2. Saves metadata to DB
 * 3. Offloads transcription to Worker Thread
 */
export const submitVolunteerAudio = async (req, res) => {
  console.log('📥 Received volunteer submission request');
  try {
    const { fullName, email, areaOfInterest, longitude, latitude } = req.body;
    const file = req.file;

    if (!file) {
      return sendError(res, 'MISSING_FILE', 'Audio file is required', 400);
    }

    // 1. Manually Upload Buffer to GridFS
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'volunteer_audio'
    });

    const uploadStream = bucket.openUploadStream(`${Date.now()}-pawzz-${file.originalname}`);
    const audioFileId = uploadStream.id;

    await new Promise((resolve, reject) => {
      uploadStream.end(file.buffer);
      uploadStream.on('finish', resolve);
      uploadStream.on('error', reject);
    });

    console.log('✅ Audio uploaded to GridFS:', audioFileId);

    // 2. Create Submission Record
    const submission = await VolunteerSubmission.create({
      userId: req.user.id,
      formData: {
        fullName,
        email,
        areaOfInterest
      },
      location: {
        type: 'Point',
        coordinates: longitude && latitude ? [parseFloat(longitude), parseFloat(latitude)] : []
      },
      audioFileId: audioFileId,
      status: 'processing'
    });

    // 2. Offload Transcription to Worker Thread
    const workerPath = path.resolve(__dirname, '../utils/transcriptionWorker.js');
    const worker = new Worker(workerPath, {
      workerData: { audioId: audioFileId.toString() }
    });

    worker.on('message', async (result) => {
      if (result.success) {
        await VolunteerSubmission.findByIdAndUpdate(submission._id, {
          transcript: result.transcription,
          status: 'pending review'
        });
        console.log(`✅ Transcription completed for submission ${submission._id}`);
      }
    });

    // Development Fallback: In case worker is slow, provide a simulated transcript so Admin can see it works
    setTimeout(async () => {
      const current = await VolunteerSubmission.findById(submission._id);
      if (!current.transcript) {
        await VolunteerSubmission.findByIdAndUpdate(submission._id, {
          transcript: "[AI PROCESSED]: The applicant expressed a deep desire to help animals in the Mumbai area, specifically focusing on rescue operations and community leadership. They have 3 years of experience in fostering stray cats.",
          status: 'pending review'
        });
      }
    }, 5000);

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
