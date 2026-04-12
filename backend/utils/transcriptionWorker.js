import { parentPort, workerData } from 'worker_threads';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { transcribeAudio } from '../services/whisperService.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

/**
 * Transcription Worker
 * Connects to DB, streams audio from GridFS, and calls Whisper API
 */
async function startWorker() {
  try {
    // 1. Connect to MongoDB inside worker
    await connectDB();

    const { audioId } = workerData;
    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: 'volunteer_audio' // Ensure this matches multer-gridfs-storage config
    });

    // 2. Download audio stream into buffer
    const chunks = [];
    const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(audioId));

    for await (const chunk of downloadStream) {
      chunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chunks);

    // 3. Transcribe using Whisper
    const transcription = await transcribeAudio(audioBuffer, `audio_${audioId}.webm`);

    parentPort.postMessage({ success: true, transcription });
  } catch (error) {
    console.error('❌ Worker Transcription Error:', error);
    parentPort.postMessage({ success: false, error: error.message });
  } finally {
    // We don't necessarily close the connection here if the worker is short-lived
    // but mongoose might hang if we don't.
    await mongoose.disconnect();
    process.exit(0);
  }
}

startWorker();
