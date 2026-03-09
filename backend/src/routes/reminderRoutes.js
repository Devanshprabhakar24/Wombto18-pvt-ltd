const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { sendReminder, getReminderLogs } = require('../controllers/reminderController');

// POST /api/reminders/send
router.post('/send', protect, sendReminder);

// GET /api/reminders/:childId
router.get('/:childId', protect, getReminderLogs);

module.exports = router;
