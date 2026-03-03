const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getUpcomingVaccinesForChild,
    getFullScheduleForChild,
    markVaccineComplete,
} = require('../controllers/vaccineController');

// GET /api/vaccines/:childId — upcoming only
router.get('/:childId', protect, getUpcomingVaccinesForChild);

// GET /api/vaccines/:childId/all — full schedule with status
router.get('/:childId/all', protect, getFullScheduleForChild);

// PATCH /api/vaccines/:childId/mark — mark vaccine complete
router.patch('/:childId/mark', protect, markVaccineComplete);

module.exports = router;