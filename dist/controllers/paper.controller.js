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
exports.deletePaper = exports.getPaperById = exports.getPapers = exports.uploadPaper = void 0;
const paperService = __importStar(require("../services/paper.service"));
const appError_1 = require("../utils/appError");
const uploadPaper = async (req, res, next) => {
    try {
        if (!req.file)
            throw new appError_1.AppError('PDF file is required', 400);
        const { title, courseId, courseCode, year, semester } = req.body;
        if (!title || !courseId || !courseCode || !year || !semester) {
            throw new appError_1.AppError('title, courseId, courseCode, year and semester are required', 400);
        }
        const paper = await paperService.uploadPaper({
            title,
            courseId,
            courseCode,
            year: parseInt(year),
            semester,
            fileBuffer: req.file.buffer,
            fileName: req.file.originalname,
            uploadedById: req.user.userId,
        });
        res.status(201).json({
            success: true,
            message: 'Paper uploaded successfully',
            data: paper,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.uploadPaper = uploadPaper;
const getPapers = async (req, res, next) => {
    try {
        const { courseCode, year, courseId, schoolId, search, page, limit } = req.query;
        const result = await paperService.getPapers({
            courseCode: courseCode,
            year: year ? parseInt(year) : undefined,
            courseId: courseId,
            schoolId: schoolId,
            search: search,
            page: page ? parseInt(page) : 1,
            limit: limit ? parseInt(limit) : 20,
        });
        res.status(200).json({
            success: true,
            message: 'Papers fetched successfully',
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getPapers = getPapers;
const getPaperById = async (req, res, next) => {
    try {
        let { id } = req.params;
        // Fix type issue
        if (Array.isArray(id))
            id = id[0];
        if (!id)
            throw new appError_1.AppError('Paper ID is required', 400);
        const paper = await paperService.getPaperById(id);
        res.status(200).json({
            success: true,
            message: 'Paper fetched successfully',
            data: paper,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getPaperById = getPaperById;
const deletePaper = async (req, res, next) => {
    try {
        let { id } = req.params;
        // Fix type issue
        if (Array.isArray(id))
            id = id[0];
        if (!id)
            throw new appError_1.AppError('Paper ID is required', 400);
        await paperService.deletePaper(id);
        res.status(200).json({
            success: true,
            message: 'Paper deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deletePaper = deletePaper;
//# sourceMappingURL=paper.controller.js.map