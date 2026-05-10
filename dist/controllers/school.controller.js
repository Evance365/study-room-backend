"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCourse = exports.createSchool = exports.getAllCourses = exports.getCoursesBySchool = exports.getSchoolById = exports.getAllSchools = void 0;
const schoolService = __importStar(require("../services/school.service"));
const appError_1 = require("../utils/appError");
const getAllSchools = async (_req, res, next) => {
    try {
        const schools = await schoolService.getAllSchools();
        res.status(200).json({
            success: true,
            message: 'Schools fetched successfully',
            data: schools,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllSchools = getAllSchools;
const getSchoolById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const school = await schoolService.getSchoolById(id);
        res.status(200).json({
            success: true,
            message: 'School fetched successfully',
            data: school,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getSchoolById = getSchoolById;
const getCoursesBySchool = async (req, res, next) => {
    try {
        const id = req.params.id;
        const courses = await schoolService.getCoursesBySchool(id);
        res.status(200).json({
            success: true,
            message: 'Courses fetched successfully',
            data: courses,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getCoursesBySchool = getCoursesBySchool;
const getAllCourses = async (_req, res, next) => {
    try {
        const courses = await schoolService.getAllCourses();
        res.status(200).json({
            success: true,
            message: 'Courses fetched successfully',
            data: courses,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllCourses = getAllCourses;
const createSchool = async (req, res, next) => {
    try {
        const { name, code, description } = req.body;
        if (!name || !code)
            throw new appError_1.AppError('name and code are required', 400);
        const school = await schoolService.createSchool({ name, code, description });
        res.status(201).json({
            success: true,
            message: 'School created successfully',
            data: school,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createSchool = createSchool;
const createCourse = async (req, res, next) => {
    try {
        const { name, code, schoolId, description } = req.body;
        if (!name || !code || !schoolId)
            throw new appError_1.AppError('name, code and schoolId are required', 400);
        const course = await schoolService.createCourse({ name, code, schoolId, description });
        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            data: course,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createCourse = createCourse;
//# sourceMappingURL=school.controller.js.map