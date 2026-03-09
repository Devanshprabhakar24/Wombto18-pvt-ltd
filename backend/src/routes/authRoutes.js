const express = require('express');
const router = express.Router();
const { register, login, sendOtp, verifyOtp, adminVerify, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { activityLogger } = require('../middleware/activityLogger');
const { rateLimiter } = require('../middleware/rateLimiter');

// Rate limit for auth endpoints (100 requests per 15 min per IP)
const authLimiter = rateLimiter(15 * 60 * 1000, 100);

// POST /api/auth/register
router.post('/register', authLimiter, register);

// POST /api/auth/login
router.post('/login', authLimiter, login);

// OTP login flow
router.post('/send-otp', authLimiter, sendOtp);
router.post('/verify-otp', authLimiter, verifyOtp);
router.post('/admin-verify', authLimiter, adminVerify);

// GET /api/auth/me (protected)
router.get('/me', protect, activityLogger('view_profile', 'user'), getMe);

module.exports = router;
