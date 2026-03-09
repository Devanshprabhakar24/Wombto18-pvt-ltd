const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { signToken } = require('../config/jwt');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    phone: { type: String },
    password: { type: String, required: true },
    state: { type: String },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
    plan_type: { type: String, enum: ['FREE', 'PREMIUM', 'ULTRA'], default: 'FREE' },
    is_tree_enrolled: { type: Boolean, default: false },
    maternal_status: { type: String, enum: ['ACTIVE', 'DELIVERED', 'MIGRATED', 'NONE'], default: 'NONE' },
    partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner' },
    createdAt: { type: Date, default: Date.now, index: true },
});

// Hash password before save
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT
userSchema.methods.generateToken = function () {
    return signToken({ id: this._id, role: this.role });
};

module.exports = mongoose.model('User', userSchema);
