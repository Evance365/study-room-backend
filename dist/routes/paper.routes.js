"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paper_controller_1 = require("../controllers/paper.controller");
const authenticate_1 = require("../middleware/authenticate");
const rateLimiter_1 = require("../middleware/rateLimiter");
const multer_1 = __importDefault(require("../config/multer"));
const router = (0, express_1.Router)();
// Public routes
router.get('/', paper_controller_1.getPapers);
router.get('/:id', paper_controller_1.getPaperById);
// Admin only routes
router.post('/upload', authenticate_1.authenticate, authenticate_1.authorizeAdmin, rateLimiter_1.uploadRateLimiter, multer_1.default.single('file'), paper_controller_1.uploadPaper);
router.delete('/:id', authenticate_1.authenticate, authenticate_1.authorizeAdmin, paper_controller_1.deletePaper);
exports.default = router;
//# sourceMappingURL=paper.routes.js.map