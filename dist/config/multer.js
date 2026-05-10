"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const fileFilter = (_req, file, cb) => {
    const allowedMimes = [
        'application/pdf',
        'application/octet-stream',
        'binary/octet-stream',
        'application/x-pdf',
    ];
    const isAllowed = allowedMimes.includes(file.mimetype) ||
        file.originalname.toLowerCase().endsWith('.pdf');
    if (isAllowed) {
        cb(null, true);
    }
    else {
        cb(new Error('Only PDF files are allowed'));
    }
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 },
});
exports.default = exports.upload;
//# sourceMappingURL=multer.js.map