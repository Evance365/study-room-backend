"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enforceJsonContentType = exports.rejectOversizedPayload = exports.sanitizeBody = void 0;
const appError_1 = require("../utils/appError");
const sanitizeString = (value) => {
    return value
        .trim()
        .replace(/<[^>]*>/g, '')
        .replace(/[<>'"`;]/g, '')
        .substring(0, 1000);
};
const sanitizeObject = (obj) => {
    const sanitized = {};
    for (const key of Object.keys(obj)) {
        const value = obj[key];
        if (typeof value === 'string') {
            sanitized[key] = sanitizeString(value);
        }
        else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            sanitized[key] = sanitizeObject(value);
        }
        else {
            sanitized[key] = value;
        }
    }
    return sanitized;
};
const sanitizeBody = (req, _res, next) => {
    if (req.body && typeof req.body === 'object') {
        req.body = sanitizeObject(req.body);
    }
    next();
};
exports.sanitizeBody = sanitizeBody;
const rejectOversizedPayload = (req, _res, next) => {
    const contentLength = parseInt(req.headers['content-length'] || '0', 10);
    const MAX_BYTES = 10 * 1024;
    if (contentLength > MAX_BYTES) {
        throw new appError_1.AppError('Payload too large. Maximum allowed size is 10KB.', 413);
    }
    next();
};
exports.rejectOversizedPayload = rejectOversizedPayload;
const enforceJsonContentType = (req, _res, next) => {
    if (req.method !== 'GET' &&
        req.method !== 'DELETE' &&
        !req.is('application/json') &&
        !req.is('multipart/form-data')) {
        throw new appError_1.AppError('Content-Type must be application/json', 415);
    }
    next();
};
exports.enforceJsonContentType = enforceJsonContentType;
//# sourceMappingURL=sanitize.js.map