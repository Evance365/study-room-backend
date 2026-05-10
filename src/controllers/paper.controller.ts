import { Response, NextFunction } from 'express';
import * as paperService from '../services/paper.service';
import { AppError } from '../utils/appError';
import { AuthRequest } from '../middleware/authenticate';

export const uploadPaper = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) throw new AppError('PDF file is required', 400);

    const { title, courseId, courseCode, year, semester } = req.body;

    if (!title || !courseId || !courseCode || !year || !semester) {
      throw new AppError(
        'title, courseId, courseCode, year and semester are required',
        400
      );
    }

    const paper = await paperService.uploadPaper({
      title,
      courseId,
      courseCode,
      year: parseInt(year),
      semester,
      fileBuffer: req.file.buffer,
      fileName: req.file.originalname,
      uploadedById: req.user!.userId,
    });

    res.status(201).json({
      success: true,
      message: 'Paper uploaded successfully',
      data: paper,
    });
  } catch (error) {
    next(error);
  }
};

export const getPapers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { courseCode, year, courseId, schoolId, search, page, limit } = req.query;

    const result = await paperService.getPapers({
      courseCode: courseCode as string,
      year: year ? parseInt(year as string) : undefined,
      courseId: courseId as string,
      schoolId: schoolId as string,
      search: search as string,
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 20,
    });

    res.status(200).json({
      success: true,
      message: 'Papers fetched successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getPaperById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let { id } = req.params;

    // Fix type issue
    if (Array.isArray(id)) id = id[0];

    if (!id) throw new AppError('Paper ID is required', 400);

    const paper = await paperService.getPaperById(id);

    res.status(200).json({
      success: true,
      message: 'Paper fetched successfully',
      data: paper,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePaper = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let { id } = req.params;

    // Fix type issue
    if (Array.isArray(id)) id = id[0];

    if (!id) throw new AppError('Paper ID is required', 400);

    await paperService.deletePaper(id);

    res.status(200).json({
      success: true,
      message: 'Paper deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};