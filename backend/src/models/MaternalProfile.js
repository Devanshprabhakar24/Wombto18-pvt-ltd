const mongoose = require('mongoose');

const maternalProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    mrn: { type: String, unique: true, index: true }, // MAT-MH-YYYYMMDD-000123
    edd: { type: Date, required: true },
    lmp: { type: Date }, // auto-calculated: EDD - 280 days
    deliveryDate: { type: Date },
    maternal_status: { type: String, enum: ['ACTIVE', 'DELIVERED', 'MIGRATED'], default: 'ACTIVE' },
    state: { type: String },
    bloodGroup: { type: String },
    weight: { type: String },
    height: { type: String },
    gravida: { type: Number },
    para: { type: Number },
    highRisk: { type: Boolean, default: false },
    vaccineSchedule: [{
        name: { type: String },
        category: { type: String, enum: ['vaccine', 'supplement', 'anc'] },
        dueDate: { type: Date },
        status: { type: String, enum: ['upcoming', 'completed', 'overdue'], default: 'upcoming' },
        completedDate: { type: Date },
    }],
    linkedChildCRN: { type: String }, // after migration
    createdAt: { type: Date, default: Date.now, index: true },
});

// Auto-calculate LMP from EDD
maternalProfileSchema.pre('save', function (next) {
    if (this.edd && !this.lmp) {
        this.lmp = new Date(this.edd.getTime() - 280 * 24 * 60 * 60 * 1000);
    }
    next();
});

module.exports = mongoose.model('MaternalProfile', maternalProfileSchema);
