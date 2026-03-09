const mongoose = require('mongoose');

const childVaccinationSchema = new mongoose.Schema({
    childId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChildProfile', required: true, index: true },
    vaccineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vaccine', required: true, index: true },
    vaccineName: { type: String, required: true },
    status: { type: String, enum: ['scheduled', 'completed', 'overdue', 'missed'], default: 'scheduled', index: true },
    scheduledDate: { type: Date },
    completedDate: { type: Date },
    administeredBy: { type: String, default: '' },
    notes: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ChildVaccination', childVaccinationSchema);
