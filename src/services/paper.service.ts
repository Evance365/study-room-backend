import { Readable } from 'stream';
import cloudinary from '../config/cloudinary';
import prisma from '../config/prisma';
import { AppError } from '../utils/appError';

interface UploadPaperInput {
  title: string;
  courseId: string;
  courseCode: string;
  year: number;
  semester: string;
  fileBuffer: Buffer;
  fileName: string;
  uploadedById: string;
}

interface CloudinaryResult {
  url: string;
  publicId: string;
}

const uploadToCloudinary = (buffer: Buffer, fileName: string): Promise<CloudinaryResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'jkuat-study-room/papers',
        resource_type: 'raw',
        public_id: Date.now() + '_' + fileName.replace(/\s+/g, '_'),
        format: 'pdf',
      },
      (error, result) => {
        if (error || !result) return reject(new AppError('Failed to upload file', 500));
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

export const uploadPaper = async (input: UploadPaperInput) => {
  const { title, courseId, courseCode, year, semester, fileBuffer, fileName, uploadedById } = input;

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new AppError('Course not found', 404);

  const existing = await prisma.paper.findFirst({ where: { courseId, year, semester, title } });
  if (existing) throw new AppError('Paper already exists', 409);

  const { url, publicId } = await uploadToCloudinary(fileBuffer, fileName);

  const paper = await prisma.paper.create({
    data: { title, courseId, courseCode, year, semester, fileUrl: url, filePublicId: publicId, uploadedById },
    include: { course: { include: { school: true } } },
  });

  return paper;
};

export const getPapers = async (filters: {
  courseCode?: string;
  year?: number;
  courseId?: string;
  schoolId?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const { courseCode, year, courseId, schoolId, search, page = 1, limit = 20 } = filters;
  const skip = (page - 1) * limit;
  const where: any = {};

  if (courseCode) where.courseCode = { contains: courseCode, mode: 'insensitive' };
  if (year) where.year = year;
  if (courseId) where.courseId = courseId;
  if (schoolId) where.course = { schoolId };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { courseCode: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [papers, total] = await Promise.all([
    prisma.paper.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { course: { include: { school: true } } },
    }),
    prisma.paper.count({ where }),
  ]);

  return {
    papers,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

export const getPaperById = async (id: string) => {
  const paper = await prisma.paper.findUnique({
    where: { id },
    include: { course: { include: { school: true } } },
  });
  if (!paper) throw new AppError('Paper not found', 404);
  return paper;
};

export const deletePaper = async (id: string) => {
  const paper = await prisma.paper.findUnique({ where: { id } });
  if (!paper) throw new AppError('Paper not found', 404);
  await cloudinary.uploader.destroy(paper.filePublicId, { resource_type: 'raw' });
  await prisma.paper.delete({ where: { id } });
};