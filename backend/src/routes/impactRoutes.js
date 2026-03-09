const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getImpact } = require('../controllers/impactController');

router.get('/', protect, getImpact);

module.exports = router;
