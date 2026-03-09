const Payment = require('../models/Payment');
const Coupon = require('../models/Coupon');
const User = require('../models/User');

const PLAN_PRICES = {
    FREE: { amount: 0, base: 0, gst: 0 },
    PREMIUM: { amount: 34900, base: 29576, gst: 5324 }, // in paise: ₹349
    ULTRA: { amount: 99900, base: 84661, gst: 15239 },  // in paise: ₹999
};

/**
 * POST /api/payments/create-order — Create payment order
 */
exports.createOrder = async (req, res, next) => {
    try {
        const { plan, couponCode } = req.body;
        if (!plan || !PLAN_PRICES[plan]) {
            return res.status(400).json({ message: 'Invalid plan.' });
        }
        if (plan === 'FREE') {
            await User.findByIdAndUpdate(req.user._id, { plan_type: 'FREE' });
            return res.status(200).json({ message: 'Free plan activated.', plan: 'FREE' });
        }

        let discount = 0;
        let coupon = null;
        if (couponCode) {
            coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
            if (!coupon) return res.status(400).json({ message: 'Invalid coupon code.' });
            if (coupon.expiresAt && coupon.expiresAt < new Date()) {
                return res.status(400).json({ message: 'Coupon has expired.' });
            }
            if (coupon.usedCount >= coupon.maxUses) {
                return res.status(400).json({ message: 'Coupon usage limit reached.' });
            }
            if (coupon.applicablePlans.length > 0 && !coupon.applicablePlans.includes(plan)) {
                return res.status(400).json({ message: 'Coupon not applicable to this plan.' });
            }

            if (coupon.type === 'flat') discount = coupon.value * 100; // to paise
            else if (coupon.type === 'percentage') discount = Math.round(PLAN_PRICES[plan].amount * coupon.value / 100);
            else if (coupon.type === 'full_waiver') discount = PLAN_PRICES[plan].amount;
        }

        const finalAmount = Math.max(0, PLAN_PRICES[plan].amount - discount);


        if (finalAmount === 0) {
            await User.findByIdAndUpdate(req.user._id, { plan_type: plan });
            if (coupon) {
                coupon.usedCount += 1;
                await coupon.save();
            }
            const payment = await Payment.create({
                userId: req.user._id,
                plan,
                amount: 0,
                baseAmount: 0,
                gstAmount: 0,
                status: 'paid',
                couponCode: couponCode || undefined,
            });
            return res.status(200).json({ message: 'Plan activated with full coupon.', payment, discount: PLAN_PRICES[plan].amount / 100, finalAmount: 0 });
        }


        const orderId = 'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);

        const payment = await Payment.create({
            userId: req.user._id,
            orderId,
            plan,
            amount: finalAmount,
            baseAmount: PLAN_PRICES[plan].base,
            gstAmount: PLAN_PRICES[plan].gst,
            status: 'created',
            couponCode: couponCode || undefined,
        });

        if (coupon) {
            coupon.usedCount += 1;
            await coupon.save();
        }

        res.status(201).json({
            orderId,
            amount: finalAmount,
            discount: discount / 100,
            finalAmount: finalAmount / 100,
            currency: 'INR',
            plan,
            paymentId: payment._id,
            key: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/payments/verify — Verify payment (webhook simulation)
 */
exports.verifyPayment = async (req, res, next) => {
    try {
        const { orderId, razorpayPaymentId } = req.body;
        const payment = await Payment.findOne({ orderId, userId: req.user._id });
        if (!payment) return res.status(404).json({ message: 'Payment not found.' });

        // In production: verify Razorpay signature here
        payment.paymentId = razorpayPaymentId || 'pay_' + Date.now();
        payment.status = 'paid';
        await payment.save();

        // Upgrade user plan
        await User.findByIdAndUpdate(req.user._id, { plan_type: payment.plan });

        res.status(200).json({ message: 'Payment verified. Plan upgraded.', plan: payment.plan });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/payments/history — Get user's payment history
 */
exports.getPaymentHistory = async (req, res, next) => {
    try {
        const payments = await Payment.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ payments });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/payments/plans — Get available plans
 */
exports.getPlans = async (req, res) => {
    res.status(200).json({
        plans: [
            { id: 'FREE', name: 'Free Plan', price: 0, display: '₹0', features: ['Masked dashboard', 'Basic reminders', 'Limited access'] },
            { id: 'PREMIUM', name: 'Premium Plan', price: 349, display: '₹349', gst: '₹53', features: ['Full maternal dashboard', 'All reminders (SMS + WhatsApp + Email)', 'Vaccine tracking', 'Growth milestones'] },
            { id: 'ULTRA', name: 'Ultra Premium', price: 999, display: '₹999', gst: '₹153', features: ['Everything in Premium', 'Womb-to-18 continuity', 'Child dashboard', 'School integration', 'Go Green certificate'] },
        ],
    });
};
