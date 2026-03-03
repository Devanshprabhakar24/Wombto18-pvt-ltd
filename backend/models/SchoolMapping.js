const mongoose = require('mongoose');

const schoolMappingSchema = new mongoose.Schema({
    childId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChildProfile', required: true, index: true },
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
});

module.exports = mongoose.model('SchoolMapping', schoolMappingSchema);
