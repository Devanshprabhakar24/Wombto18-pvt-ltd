const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    action: { type: String, required: true },
    resource: { type: String, default: '' },
    resourceId: { type: mongoose.Schema.Types.ObjectId },
    details: { type: String, default: '' },
    ipAddress: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now, index: true },
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
