const mongoose = require('mongoose');

const partnerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['hospital', 'doctor', 'school', 'csr', 'clinic', 'ngo', 'other'], required: true },
    email: { type: String, required: true },
    phone: { type: String },
    referralId: { type: String, unique: true, index: true }, // e.g. CPA123
    totalReferrals: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Partner', partnerSchema);
