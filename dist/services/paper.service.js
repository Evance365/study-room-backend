"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePaper = exports.getPaperById = exports.getPapers = exports.uploadPaper = void 0;
const stream_1 = require("stream");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const prisma_1 = __importDefault(require("../config/prisma"));
const appError_1 = require("../utils/appError");
const uploadToCloudinary = (buffer, fileName) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.default.uploader.upload_stream({
            folder: 'jkuat-study-room/papers',
            resource_type: 'raw',
            public_id: Date.now() + '_' + fileName.replace(/\s+/g, '_'),
            format: 'pdf',
        }, (error, result) => {
            if (error || !result)
                return reject(new appError_1.AppError('Failed to upload file', 500));
            resolve({ url: result.secure_url, publicId: result.public_id });
        });
        const readable = new stream_1.Readable();
        readable.push(buffer);
        readable.push(null);
        readable.pipe(uploadStream);
    });
};
const uploadPaper = async (input) => {
    const { title, courseId, courseCode, year, semester, fileBuffer, fileName, uploadedById } = input;
    const course = await prisma_1.default.course.findUnique({ where: { id: courseId } });
    if (!course)
        throw new appError_1.AppError('Course not found', 404);
    const existing = await prisma_1.default.paper.findFirst({ where: { courseId, year, semester, title } });
    if (existing)
        throw new appError_1.AppError('Paper already exists', 409);
    const { url, publicId } = await uploadToCloudinary(fileBuffer, fileName);
    const paper = await prisma_1.default.paper.create({
        data: { title, courseId, courseCode, year, semester, fileUrl: url, filePublicId: publicId, uploadedById },
        include: { course: { include: { school: true } } },
    });
    return paper;
};
exports.uploadPaper = uploadPaper;
const getPapers = async (filters) => {
    const { courseCode, year, courseId, schoolId, search, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;
    const where = {};
    if (courseCode)
        where.courseCode = { contains: courseCode, mode: 'insensitive' };
    if (year)
        where.year = year;
    if (courseId)
        where.courseId = courseId;
    if (schoolId)
        where.course = { schoolId };
    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { courseCode: { contains: search, mode: 'insensitive' } },
        ];
    }
    const [papers, total] = await Promise.all([
        prisma_1.default.paper.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: { course: { include: { school: true } } },
        }),
        prisma_1.default.paper.count({ where }),
    ]);
    return {
        papers,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
};
exports.getPapers = getPapers;
const getPaperById = async (id) => {
    const paper = await prisma_1.default.paper.findUnique({
        where: { id },
        include: { course: { include: { school: true } } },
    });
    if (!paper)
        throw new appError_1.AppError('Paper not found', 404);
    return paper;
};
exports.getPaperById = getPaperById;
const deletePaper = async (id) => {
    const paper = await prisma_1.default.paper.findUnique({ where: { id } });
    if (!paper)
        throw new appError_1.AppError('Paper not found', 404);
    await cloudinary_1.default.uploader.destroy(paper.filePublicId, { resource_type: 'raw' });
    await prisma_1.default.paper.delete({ where: { id } });
};
exports.deletePaper = deletePaper;
//# sourceMappingURL=paper.service.js.map