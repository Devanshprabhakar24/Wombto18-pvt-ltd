const mongoose = require('mongoose');

const greenCohortImpactSchema = new mongoose.Schema({
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    impactScore: { type: Number, required: true },
    treeCount: { type: Number, default: 0 },
    sustainabilityLevel: { type: String },
});

module.exports = mongoose.model('GreenCohortImpact', greenCohortImpactSchema);
