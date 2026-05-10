import { Router } from 'express';
import {
  getAllSchools,
  getSchoolById,
  getCoursesBySchool,
  getAllCourses,
  createSchool,
  createCourse,
} from '../controllers/school.controller';
import { authenticate, authorizeAdmin } from '../middleware/authenticate';

const router = Router();

// Public routes
router.get('/', getAllSchools);
router.get('/courses', getAllCourses);
router.get('/:id', getSchoolById);
router.get('/:id/courses', getCoursesBySchool);

// Admin only
router.post('/', authenticate, authorizeAdmin, createSchool);
router.post('/courses', authenticate, authorizeAdmin, createCourse);

export default router;