const express = require('express');
const router = express.Router();
const { registerParent, loginParent, getMe } = require('../controllers/parentController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/parents/register
router.post('/register', registerParent);

// POST /api/parents/login
router.post('/login', loginParent);

// GET /api/parents/me (protected)
router.get('/me', protect, getMe);

module.exports = router;
