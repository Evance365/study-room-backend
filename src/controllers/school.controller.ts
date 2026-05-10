import { Request, Response, NextFunction } from 'express';
import * as schoolService from '../services/school.service';
import { AppError } from '../utils/appError';

export const getAllSchools = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const schools = await schoolService.getAllSchools();
    res.status(200).json({
      success: true,
      message: 'Schools fetched successfully',
      data: schools,
    });
  } catch (error) { next(error); }
};

export const getSchoolById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const school = await schoolService.getSchoolById(id);
    res.status(200).json({
      success: true,
      message: 'School fetched successfully',
      data: school,
    });
  } catch (error) { next(error); }
};

export const getCoursesBySchool = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const courses = await schoolService.getCoursesBySchool(id);
    res.status(200).json({
      success: true,
      message: 'Courses fetched successfully',
      data: courses,
    });
  } catch (error) { next(error); }
};

export const getAllCourses = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const courses = await schoolService.getAllCourses();
    res.status(200).json({
      success: true,
      message: 'Courses fetched successfully',
      data: courses,
    });
  } catch (error) { next(error); }
};

export const createSchool = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, code, description } = req.body;
    if (!name || !code) throw new AppError('name and code are required', 400);
    const school = await schoolService.createSchool({ name, code, description });
    res.status(201).json({
      success: true,
      message: 'School created successfully',
      data: school,
    });
  } catch (error) { next(error); }
};

export const createCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, code, schoolId, description } = req.body;
    if (!name || !code || !schoolId) throw new AppError('name, code and schoolId are required', 400);
    const course = await schoolService.createCourse({ name, code, schoolId, description });
    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course,
    });
  } catch (error) { next(error); }
};