import { Router } from 'express';
import {
  uploadPaper,
  getPapers,
  getPaperById,
  deletePaper,
} from '../controllers/paper.controller';
import { authenticate, authorizeAdmin } from '../middleware/authenticate';
import { uploadRateLimiter } from '../middleware/rateLimiter';
import upload from '../config/multer';

const router = Router();

// Public routes
router.get('/', getPapers);
router.get('/:id', getPaperById);

// Admin only routes
router.post('/upload', authenticate, authorizeAdmin, uploadRateLimiter, upload.single('file'), uploadPaper);
router.delete('/:id', authenticate, authorizeAdmin, deletePaper);

export default router;