const mongoose = require('mongoose');

const reminderLogSchema = new mongoose.Schema({
    childId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChildProfile', required: true, index: true },
    vaccineName: { type: String, required: true },
    type: { type: String, enum: ['email', 'sms'], required: true },
    status: { type: String, enum: ['sent', 'failed'], required: true },
    timestamp: { type: Date, default: Date.now, index: true },
});

module.exports = mongoose.model('ReminderLog', reminderLogSchema);
