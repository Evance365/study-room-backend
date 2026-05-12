import jwt from 'jsonwebtoken';
import { AppError } from './appError';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
};

export const generateAccessToken = (payload: JwtPayload): string => {
  const secret = getEnvVar('JWT_SECRET');
  const expiresIn = process.env.JWT_EXPIRES_IN || '15m';
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  const secret = getEnvVar('JWT_REFRESH_SECRET');
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  try {
    const secret = getEnvVar('JWT_SECRET');
    return jwt.verify(token, secret) as JwtPayload;
  } catch {
    throw new AppError('Invalid or expired access token', 401);
  }
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  try {
    const secret = getEnvVar('JWT_REFRESH_SECRET');
    return jwt.verify(token, secret) as JwtPayload;
  } catch {
    throw new AppError('Invalid or expired refresh token', 401);
  }
};