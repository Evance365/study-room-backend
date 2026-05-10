"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const rateLimiter_1 = require("../middleware/rateLimiter");
const sanitize_1 = require("../middleware/sanitize");
const auth_validator_1 = require("../middleware/validators/auth.validator");
const router = (0, express_1.Router)();
router.use(sanitize_1.enforceJsonContentType);
router.use(sanitize_1.rejectOversizedPayload);
router.use(sanitize_1.sanitizeBody);
router.post('/register', rateLimiter_1.authRateLimiter, auth_validator_1.registerRules, auth_validator_1.validate, auth_controller_1.register);
router.post('/login', rateLimiter_1.authRateLimiter, auth_validator_1.loginRules, auth_validator_1.validate, auth_controller_1.login);
router.post('/refresh', rateLimiter_1.authRateLimiter, auth_validator_1.refreshRules, auth_validator_1.validate, auth_controller_1.refresh);
router.post('/logout', rateLimiter_1.authRateLimiter, auth_validator_1.refreshRules, auth_validator_1.validate, auth_controller_1.logout);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map