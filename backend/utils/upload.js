import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import { env } from '../config/env.js';

/**
 * Configure GridFS Storage engine for Multer
 * Handles Large File Storage (Audio/Videos) efficiently in MongoDB
 */
const storage = new GridFsStorage({
  url: env.MONGODB_URI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      bucketName: 'volunteer_audio', // Name of the GridFS collection
      filename: `${Date.now()}-pawzz-${file.originalname}`
    };
  }
});

export const upload = multer({ storage });
