const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getImpact } = require('../controllers/greenCohortController');

router.get('/', protect, getImpact);

module.exports = router;
