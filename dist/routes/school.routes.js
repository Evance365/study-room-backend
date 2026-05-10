"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const school_controller_1 = require("../controllers/school.controller");
const authenticate_1 = require("../middleware/authenticate");
const router = (0, express_1.Router)();
// Public routes
router.get('/', school_controller_1.getAllSchools);
router.get('/courses', school_controller_1.getAllCourses);
router.get('/:id', school_controller_1.getSchoolById);
router.get('/:id/courses', school_controller_1.getCoursesBySchool);
// Admin only
router.post('/', authenticate_1.authenticate, authenticate_1.authorizeAdmin, school_controller_1.createSchool);
router.post('/courses', authenticate_1.authenticate, authenticate_1.authorizeAdmin, school_controller_1.createCourse);
exports.default = router;
//# sourceMappingURL=school.routes.js.map