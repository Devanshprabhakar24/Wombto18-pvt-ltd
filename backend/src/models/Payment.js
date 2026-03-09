const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    orderId: { type: String }, // Razorpay order ID
    paymentId: { type: String }, // Razorpay payment ID
    plan: { type: String, enum: ['FREE', 'PREMIUM', 'ULTRA'], required: true },
    amount: { type: Number, required: true }, // in paise
    baseAmount: { type: Number },
    gstAmount: { type: Number },
    currency: { type: String, default: 'INR' },
    status: { type: String, enum: ['created', 'paid', 'failed', 'refunded'], default: 'created' },
    couponCode: { type: String },
    invoiceUrl: { type: String },
    createdAt: { type: Date, default: Date.now, index: true },
});

module.exports = mongoose.model('Payment', paymentSchema);
