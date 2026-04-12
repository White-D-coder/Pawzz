import multer from 'multer';

/**
 * Using Memory Storage to avoid GridFS Storage Engine bugs.
 * Files will be manually streamed to GridFS in the controller.
 */
const storage = multer.memoryStorage();

export const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});
