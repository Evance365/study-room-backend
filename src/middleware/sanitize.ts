import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';

const sanitizeString = (value: string): string => {
  return value
    .trim()
    .replace(/<[^>]*>/g, '')
    .replace(/[<>'"`;]/g, '')
    .substring(0, 1000);
};

const sanitizeObject = (obj: Record<string, unknown>): Record<string, unknown> => {
  const sanitized: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};

export const sanitizeBody = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  next();
};

export const rejectOversizedPayload = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const contentLength = parseInt(req.headers['content-length'] || '0', 10);
  const MAX_BYTES = 10 * 1024;
  if (contentLength > MAX_BYTES) {
    throw new AppError('Payload too large. Maximum allowed size is 10KB.', 413);
  }
  next();
};

export const enforceJsonContentType = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (
    req.method !== 'GET' &&
    req.method !== 'DELETE' &&
    !req.is('application/json') &&
    !req.is('multipart/form-data')
  ) {
    throw new AppError('Content-Type must be application/json', 415);
  }
  next();
};