import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JwtPayload } from '../utils/jwt';
import { AppError } from '../utils/appError';

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authenticate = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Access token missing', 401);
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

export const authorizeAdmin = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  try {
    if (req.user?.role !== 'ADMIN') {
      throw new AppError('Access denied. Admins only.', 403);
    }
    next();
  } catch (error) {
    next(error);
  }
};