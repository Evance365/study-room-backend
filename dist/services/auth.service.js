"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.refreshAccessToken = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const prisma_1 = __importDefault(require("../config/prisma"));
const jwt_1 = require("../utils/jwt");
const appError_1 = require("../utils/appError");
const registerUser = async (input) => {
    const { fullName, email, password, studentId } = input;
    const existingUser = await prisma_1.default.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new appError_1.AppError('Email already registered', 409);
    }
    if (studentId) {
        const existingStudentId = await prisma_1.default.user.findUnique({ where: { studentId } });
        if (existingStudentId) {
            throw new appError_1.AppError('Student ID already registered', 409);
        }
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 12);
    const user = await prisma_1.default.user.create({
        data: {
            fullName,
            email,
            password: hashedPassword,
            studentId,
        },
        select: {
            id: true,
            fullName: true,
            email: true,
            studentId: true,
            role: true,
            isVerified: true,
            createdAt: true,
        },
    });
    return user;
};
exports.registerUser = registerUser;
const loginUser = async (input) => {
    const { email, password } = input;
    const user = await prisma_1.default.user.findUnique({ where: { email } });
    if (!user) {
        throw new appError_1.AppError('Invalid email or password', 401);
    }
    const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        throw new appError_1.AppError('Invalid email or password', 401);
    }
    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = (0, jwt_1.generateAccessToken)(payload);
    const refreshToken = (0, jwt_1.generateRefreshToken)(payload);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await prisma_1.default.refreshToken.create({
        data: {
            id: (0, uuid_1.v4)(),
            token: refreshToken,
            userId: user.id,
            expiresAt,
        },
    });
    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            studentId: user.studentId,
            role: user.role,
            isVerified: user.isVerified,
        },
    };
};
exports.loginUser = loginUser;
const refreshAccessToken = async (token) => {
    const decoded = (0, jwt_1.verifyRefreshToken)(token);
    const storedToken = await prisma_1.default.refreshToken.findUnique({
        where: { token },
    });
    if (!storedToken) {
        throw new appError_1.AppError('Refresh token not found', 401);
    }
    if (storedToken.expiresAt < new Date()) {
        await prisma_1.default.refreshToken.delete({ where: { token } });
        throw new appError_1.AppError('Refresh token expired', 401);
    }
    const accessToken = (0, jwt_1.generateAccessToken)({
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
    });
    return { accessToken };
};
exports.refreshAccessToken = refreshAccessToken;
const logoutUser = async (token) => {
    await prisma_1.default.refreshToken.deleteMany({
        where: { token },
    });
};
exports.logoutUser = logoutUser;
//# sourceMappingURL=auth.service.js.map