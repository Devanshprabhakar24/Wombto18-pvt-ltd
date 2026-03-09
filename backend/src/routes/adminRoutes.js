const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { roleCheck } = require('../middleware/roleMiddleware');
const { activityLogger } = require('../middleware/activityLogger');
const adminController = require('../controllers/adminController');

// Admin IP allowlist middleware (production only)
const adminIpCheck = (req, res, next) => {
    const { NODE_ENV } = require('../config/env');
    if (NODE_ENV !== 'production') return next();
    const allowedIps = process.env.ADMIN_ALLOWED_IPS ? process.env.ADMIN_ALLOWED_IPS.split(',') : [];
    if (allowedIps.length === 0) return next(); // no restriction if not configured
    const clientIp = req.ip || req.connection.remoteAddress;
    if (!allowedIps.includes(clientIp)) {
        return res.status(403).json({ message: 'Admin access denied from this IP.' });
    }
    next();
};

// Apply IP check to all admin routes
router.use(adminIpCheck);

router.get('/stats', protect, roleCheck('admin'), adminController.getStats);
router.get('/enhanced-stats', protect, roleCheck('admin'), adminController.getEnhancedStats);
router.get('/children', protect, roleCheck('admin'), adminController.getChildren);
router.get('/parents', protect, roleCheck('admin'), adminController.getParents);
router.get('/export-csv', protect, roleCheck('admin'), activityLogger('export_csv', 'parents'), adminController.exportParentsCSV);
router.get('/reminder-logs', protect, roleCheck('admin'), adminController.getReminderLogs);
router.post('/send-reminder', protect, roleCheck('admin'), activityLogger('send_reminder', 'reminder'), adminController.sendManualReminder);
router.patch('/reminder-status/:id', protect, roleCheck('admin'), activityLogger('update_reminder', 'reminder'), adminController.updateReminderStatus);
router.get('/activity-logs', protect, roleCheck('admin'), adminController.getActivityLogs);

// Coupon management
router.post('/coupons', protect, roleCheck('admin'), activityLogger('create_coupon', 'coupon'), adminController.createCoupon);
router.get('/coupons', protect, roleCheck('admin'), adminController.listCoupons);
router.delete('/coupons/:id', protect, roleCheck('admin'), activityLogger('delete_coupon', 'coupon'), adminController.deleteCoupon);

// Payment logs
router.get('/payment-logs', protect, roleCheck('admin'), adminController.getPaymentLogs);

// Manual plan upgrade
router.post('/manual-upgrade', protect, roleCheck('admin'), activityLogger('manual_upgrade', 'user'), adminController.manualUpgrade);

module.exports = router;
