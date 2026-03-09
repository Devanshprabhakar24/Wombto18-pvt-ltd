const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getMe, updateProfile } = require('../controllers/parentController');

// GET /api/parents/me
router.get('/me', protect, getMe);

// PUT /api/parents/me
router.put('/me', protect, updateProfile);

module.exports = router;
