import { Router } from 'express';
import { register, login, refresh, logout } from '../controllers/auth.controller';
import { authRateLimiter } from '../middleware/rateLimiter';
import { sanitizeBody, rejectOversizedPayload, enforceJsonContentType } from '../middleware/sanitize';
import { registerRules, loginRules, refreshRules, validate } from '../middleware/validators/auth.validator';
const router = Router();

// Apply to all auth routes
router.use(enforceJsonContentType);
router.use(rejectOversizedPayload);
router.use(sanitizeBody);

// Routes with rate limiting + validation
router.post('/register', authRateLimiter, registerRules, validate, register);
router.post('/login',    authRateLimiter, loginRules,    validate, login);
router.post('/refresh',  authRateLimiter, refreshRules,  validate, refresh);
router.post('/logout',   authRateLimiter, refreshRules,  validate, logout);

export default router;