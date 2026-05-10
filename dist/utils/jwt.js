"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const appError_1 = require("./appError");
const getEnvVar = (key) => {
    const value = process.env[key];
    if (!value)
        throw new Error('Missing environment variable: ' + key);
    return value;
};
const generateAccessToken = (payload) => {
    const secret = getEnvVar('JWT_SECRET');
    const expiresIn = process.env.JWT_EXPIRES_IN || '15m';
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (payload) => {
    const secret = getEnvVar('JWT_REFRESH_SECRET');
    const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
};
exports.generateRefreshToken = generateRefreshToken;
const verifyAccessToken = (token) => {
    try {
        const secret = getEnvVar('JWT_SECRET');
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch {
        throw new appError_1.AppError('Invalid or expired access token', 401);
    }
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    try {
        const secret = getEnvVar('JWT_REFRESH_SECRET');
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch {
        throw new appError_1.AppError('Invalid or expired refresh token', 401);
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
//# sourceMappingURL=jwt.js.map