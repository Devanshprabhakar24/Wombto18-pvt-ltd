const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

router.get('/parents', protect, adminOnly, adminController.getParents);
router.get('/export-csv', protect, adminOnly, adminController.exportParentsCSV);
router.patch('/reminder-status/:id', protect, adminOnly, adminController.updateReminderStatus);

module.exports = router;