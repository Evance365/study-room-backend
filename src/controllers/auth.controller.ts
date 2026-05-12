import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { AppError } from '../utils/appError';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { fullName, email, password, studentId } = req.body;
    if (!fullName || !email || !password) {
      throw new AppError('fullName, email and password are required', 400);
    }
    const user = await authService.registerUser({ fullName, email, password, studentId });
    res.status(201).json({ success: true, message: 'Account created successfully', data: user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }
    const result = await authService.loginUser({ email, password });
    res.status(200).json({ success: true, message: 'Login successful', data: result });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400);
    }
    const result = await authService.refreshAccessToken(refreshToken);
    res.status(200).json({ success: true, message: 'Token refreshed', data: result });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400);
    }
    await authService.logoutUser(refreshToken);
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};