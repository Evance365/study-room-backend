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
exports.logout = exports.refresh = exports.login = exports.register = void 0;
const authService = __importStar(require("../services/auth.service"));
const appError_1 = require("../utils/appError");
const register = async (req, res, next) => {
    try {
        const { fullName, email, password, studentId } = req.body;
        if (!fullName || !email || !password)
            throw new appError_1.AppError('fullName, email and password are required', 400);
        const user = await authService.registerUser({ fullName, email, password, studentId });
        res.status(201).json({ success: true, message: 'Account created successfully', data: user });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            throw new appError_1.AppError('Email and password are required', 400);
        const result = await authService.loginUser({ email, password });
        res.status(200).json({ success: true, message: 'Login successful', data: result });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken)
            throw new appError_1.AppError('Refresh token is required', 400);
        const result = await authService.refreshAccessToken(refreshToken);
        res.status(200).json({ success: true, message: 'Token refreshed', data: result });
    }
    catch (error) {
        next(error);
    }
};
exports.refresh = refresh;
const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken)
            throw new appError_1.AppError('Refresh token is required', 400);
        await authService.logoutUser(refreshToken);
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
//# sourceMappingURL=auth.controller.js.map