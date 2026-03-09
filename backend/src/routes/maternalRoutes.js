const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { activityLogger } = require('../middleware/activityLogger');
const maternalController = require('../controllers/maternalController');

router.post('/register', protect, activityLogger('maternal_register', 'maternal'), maternalController.registerMaternal);
router.get('/profile', protect, maternalController.getProfile);
router.post('/mark-vaccine', protect, activityLogger('maternal_vaccine', 'maternal'), maternalController.markVaccineComplete);
router.post('/migrate', protect, activityLogger('maternal_migrate', 'maternal'), maternalController.migrateToChild);
router.post('/delivery', protect, activityLogger('maternal_delivery', 'maternal'), maternalController.recordDelivery);

module.exports = router;
