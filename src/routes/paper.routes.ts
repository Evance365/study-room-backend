import { Router } from 'express';
import { uploadPaper, getPapers, getPaperById, deletePaper } from '../controllers/paper.controller';
import { authenticate, authorizeAdmin } from '../middleware/authenticate';
import { uploadRateLimiter } from '../middleware/rateLimiter';
import upload from '../config/multer';

const router = Router();

router.get('/', getPapers);
router.get('/:id', getPaperById);
router.post('/upload', authenticate, authorizeAdmin, uploadRateLimiter, upload.single('file'), uploadPaper);
router.delete('/:id', authenticate, authorizeAdmin, deletePaper);

export default router;