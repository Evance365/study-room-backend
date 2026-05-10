"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCourse = exports.createSchool = exports.getAllCourses = exports.getCoursesBySchool = exports.getSchoolById = exports.getAllSchools = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const appError_1 = require("../utils/appError");
const getAllSchools = async () => {
    const schools = await prisma_1.default.school.findMany({
        orderBy: { name: 'asc' },
        include: {
            _count: {
                select: { courses: true },
            },
        },
    });
    return schools;
};
exports.getAllSchools = getAllSchools;
const getSchoolById = async (id) => {
    const school = await prisma_1.default.school.findUnique({
        where: { id },
        include: {
            courses: {
                orderBy: { name: 'asc' },
                include: {
                    _count: {
                        select: { papers: true },
                    },
                },
            },
        },
    });
    if (!school)
        throw new appError_1.AppError('School not found', 404);
    return school;
};
exports.getSchoolById = getSchoolById;
const getCoursesBySchool = async (schoolId) => {
    const courses = await prisma_1.default.course.findMany({
        where: { schoolId },
        orderBy: { name: 'asc' },
        include: {
            _count: {
                select: { papers: true },
            },
        },
    });
    return courses;
};
exports.getCoursesBySchool = getCoursesBySchool;
const getAllCourses = async () => {
    const courses = await prisma_1.default.course.findMany({
        orderBy: { code: 'asc' },
        include: {
            school: true,
            _count: {
                select: { papers: true },
            },
        },
    });
    return courses;
};
exports.getAllCourses = getAllCourses;
const createSchool = async (data) => {
    const existing = await prisma_1.default.school.findUnique({ where: { code: data.code } });
    if (existing)
        throw new appError_1.AppError('School with this code already exists', 409);
    return await prisma_1.default.school.create({ data });
};
exports.createSchool = createSchool;
const createCourse = async (data) => {
    const existing = await prisma_1.default.course.findUnique({ where: { code: data.code } });
    if (existing)
        throw new appError_1.AppError('Course with this code already exists', 409);
    const school = await prisma_1.default.school.findUnique({ where: { id: data.schoolId } });
    if (!school)
        throw new appError_1.AppError('School not found', 404);
    return await prisma_1.default.course.create({ data, include: { school: true } });
};
exports.createCourse = createCourse;
//# sourceMappingURL=school.service.js.map