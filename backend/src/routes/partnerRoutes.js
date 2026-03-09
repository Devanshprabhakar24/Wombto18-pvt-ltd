const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { roleCheck } = require('../middleware/roleMiddleware');
const partnerController = require('../controllers/partnerController');

router.post('/register', partnerController.registerPartner);
router.get('/:referralId/dashboard', partnerController.getPartnerDashboard);
router.get('/', protect, roleCheck('admin'), partnerController.listPartners);

module.exports = router;
