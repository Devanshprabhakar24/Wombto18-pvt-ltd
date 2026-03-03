const mongoose = require('mongoose');

const childProfileSchema = new mongoose.Schema({
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    birthHospital: { type: String, default: '' },
    completedVaccines: [{ type: String }],
    createdAt: { type: Date, default: Date.now, index: true },
});

module.exports = mongoose.model('ChildProfile', childProfileSchema);
