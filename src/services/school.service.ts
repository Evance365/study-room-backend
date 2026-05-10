import prisma from '../config/prisma';
import { AppError } from '../utils/appError';

export const getAllSchools = async () => {
  const schools = await prisma.school.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { courses: true },
      },
    },
  });
  return schools;
};

export const getSchoolById = async (id: string) => {
  const school = await prisma.school.findUnique({
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
  if (!school) throw new AppError('School not found', 404);
  return school;
};

export const getCoursesBySchool = async (schoolId: string) => {
  const courses = await prisma.course.findMany({
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

export const getAllCourses = async () => {
  const courses = await prisma.course.findMany({
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

export const createSchool = async (data: {
  name: string;
  code: string;
  description?: string;
}) => {
  const existing = await prisma.school.findUnique({ where: { code: data.code } });
  if (existing) throw new AppError('School with this code already exists', 409);

  return await prisma.school.create({ data });
};

export const createCourse = async (data: {
  name: string;
  code: string;
  schoolId: string;
  description?: string;
}) => {
  const existing = await prisma.course.findUnique({ where: { code: data.code } });
  if (existing) throw new AppError('Course with this code already exists', 409);

  const school = await prisma.school.findUnique({ where: { id: data.schoolId } });
  if (!school) throw new AppError('School not found', 404);

  return await prisma.course.create({ data, include: { school: true } });
};