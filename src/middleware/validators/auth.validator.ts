import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/appError';

export const validate = (req: Request, _res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg).join(', ');
    throw new AppError(messages, 422);
  }
  next();
};

export const registerRules = [
  body('fullName').trim().notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Full name must be 2-100 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Full name must contain letters only'),
  body('email').trim().notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address').normalizeEmail()
    .isLength({ max: 255 }).withMessage('Email too long'),
  body('password').notEmpty().withMessage('Password is required')
    .isLength({ min: 8, max: 64 }).withMessage('Password must be 8-64 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number'),
  body('studentId').optional().trim()
    .isLength({ min: 5, max: 30 }).withMessage('Student ID must be 5-30 characters')
    .matches(/^[a-zA-Z0-9\-\/]+$/).withMessage('Student ID contains invalid characters'),
];

export const loginRules = [
  body('email').trim().notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
    .isLength({ max: 64 }).withMessage('Password too long'),
];

export const refreshRules = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required')
    .isString().withMessage('Invalid token format'),
];
