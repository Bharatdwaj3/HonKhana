import express from 'express';
import { storage } from '../config/firebase-admin.config.ts';
import type { AuthRequest } from '../middleware/fireauth.middleware.ts';


type Request = express.Request;
type Response = express.Response;
type NextFunction = express.NextFunction;


// Upload file
export const uploadFile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const file = req.file;
    const fileName = `${Date.now()}_${file.originalname}`;
    const blob = storage.file(fileName);

    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
        metadata: {
          uploadedBy: req.user?.uid || 'anonymous',
        },
      },
    });

    blobStream.on('error', (error) => {
      console.error('Upload error:', error);
      res.status(500).json({ message: 'Upload failed', error: error.message });
    });

    blobStream.on('finish', async () => {
      const publicUrl = `http://localhost:9199/${storage.name}/${fileName}`;
      
      res.status(200).json({
        message: 'File uploaded successfully',
        fileName: fileName,
        url: publicUrl,
      });
    });

    blobStream.end(file.buffer);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Upload failed';
    res.status(500).json({ message });
  }
};

// Get file URL
export const getFileUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fileName } = req.params;
    const file = storage.file(fileName);

    const [exists] = await file.exists();
    if (!exists) {
      res.status(404).json({ message: 'File not found' });
      return;
    }

    const publicUrl = `http://localhost:9199/${storage.name}/${fileName}`;
    res.status(200).json({ url: publicUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get file';
    res.status(500).json({ message });
  }
};

// Delete file
export const deleteFile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { fileName } = req.params;
    const file = storage.file(fileName);

    await file.delete();
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete file';
    res.status(500).json({ message });
  }
};

// List files
export const listFiles = async (req: Request, res: Response): Promise<void> => {
  try {
    const [files] = await storage.getFiles();
    
    const fileList = files.map(file => ({
      name: file.name,
      size: file.metadata.size,
      contentType: file.metadata.contentType,
      created: file.metadata.timeCreated,
    }));

    res.status(200).json({ files: fileList });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list files';
    res.status(500).json({ message });
  }
};