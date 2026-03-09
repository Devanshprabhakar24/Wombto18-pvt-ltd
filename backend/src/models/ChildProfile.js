const mongoose = require('mongoose');

const childProfileSchema = new mongoose.Schema({
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    crn: { type: String, unique: true, sparse: true }, // CHD-MH-YYYYMMDD-000123
    mrn_linked: { type: String }, // linked maternal MRN
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    birthWeight: { type: String },
    bloodGroup: { type: String },
    apgarScore: { type: Number },
    birthHospital: { type: String, default: '' },
    completedVaccines: [{ type: String }],
    migratedFromMaternal: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now, index: true },
});

module.exports = mongoose.model('ChildProfile', childProfileSchema);
