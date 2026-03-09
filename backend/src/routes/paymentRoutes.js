const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { activityLogger } = require('../middleware/activityLogger');
const paymentController = require('../controllers/paymentController');

router.get('/plans', paymentController.getPlans);
router.post('/create-order', protect, activityLogger('create_payment', 'payment'), paymentController.createOrder);
router.post('/verify', protect, activityLogger('verify_payment', 'payment'), paymentController.verifyPayment);
router.get('/history', protect, paymentController.getPaymentHistory);

module.exports = router;
