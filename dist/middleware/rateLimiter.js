"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRateLimiter = exports.generalRateLimiter = exports.authRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.authRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === 'development' ? 100 : 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many attempts. Please try again after 15 minutes.',
    },
    skipSuccessfulRequests: true,
});
exports.generalRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === 'development' ? 500 : 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests. Please slow down.',
    },
});
exports.uploadRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: process.env.NODE_ENV === 'development' ? 100 : 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Upload limit reached. Try again in an hour.',
    },
});
//# sourceMappingURL=rateLimiter.js.map