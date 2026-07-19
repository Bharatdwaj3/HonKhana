import { Router } from 'express';
import multer from 'multer';
import { firebaseAuth } from '../middleware/fireauth.middleware.ts';
import {
  uploadFile,
  getFileUrl,
  deleteFile,
  listFiles,
} from '../controller/storage.controller.ts';

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Upload file (protected)
router.post('/upload', firebaseAuth, upload.single('file'), uploadFile);

// Get file URL (public)
router.get('/file/:fileName', getFileUrl);

// List all files (public)
router.get('/files', listFiles);

// Delete file (protected)
router.delete('/file/:fileName', firebaseAuth, deleteFile);

export default router;