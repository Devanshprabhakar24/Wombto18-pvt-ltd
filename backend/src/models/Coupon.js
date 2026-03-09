const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true },
    type: { type: String, enum: ['flat', 'percentage', 'full_waiver'], required: true },
    value: { type: Number, default: 0 }, // flat amount or percentage
    applicablePlans: [{ type: String, enum: ['PREMIUM', 'ULTRA'] }],
    maxUses: { type: Number, default: 100 },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Coupon', couponSchema);
