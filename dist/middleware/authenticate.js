"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeAdmin = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const appError_1 = require("../utils/appError");
const authenticate = (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new appError_1.AppError('Access token missing', 401);
        }
        const token = authHeader.split(' ')[1];
        const decoded = (0, jwt_1.verifyAccessToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.authenticate = authenticate;
const authorizeAdmin = (req, _res, next) => {
    try {
        if (req.user?.role !== 'ADMIN') {
            throw new appError_1.AppError('Access denied. Admins only.', 403);
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.authorizeAdmin = authorizeAdmin;
//# sourceMappingURL=authenticate.js.map