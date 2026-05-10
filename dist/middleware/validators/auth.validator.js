"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshRules = exports.loginRules = exports.registerRules = exports.validate = void 0;
const express_validator_1 = require("express-validator");
const appError_1 = require("../../utils/appError");
const validate = (req, _res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const messages = errors.array().map((e) => e.msg).join(', ');
        throw new appError_1.AppError(messages, 422);
    }
    next();
};
exports.validate = validate;
exports.registerRules = [
    (0, express_validator_1.body)('fullName').trim().notEmpty().withMessage('Full name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Full name must be 2-100 characters')
        .matches(/^[a-zA-Z\s]+$/).withMessage('Full name must contain letters only'),
    (0, express_validator_1.body)('email').trim().notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email address').normalizeEmail()
        .isLength({ max: 255 }).withMessage('Email too long'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required')
        .isLength({ min: 8, max: 64 }).withMessage('Password must be 8-64 characters')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number'),
    (0, express_validator_1.body)('studentId').optional().trim()
        .isLength({ min: 5, max: 30 }).withMessage('Student ID must be 5-30 characters')
        .matches(/^[a-zA-Z0-9\-\/]+$/).withMessage('Student ID contains invalid characters'),
];
exports.loginRules = [
    (0, express_validator_1.body)('email').trim().notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email address').normalizeEmail(),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required')
        .isLength({ max: 64 }).withMessage('Password too long'),
];
exports.refreshRules = [
    (0, express_validator_1.body)('refreshToken').notEmpty().withMessage('Refresh token is required')
        .isString().withMessage('Invalid token format'),
];
//# sourceMappingURL=auth.validator.js.map