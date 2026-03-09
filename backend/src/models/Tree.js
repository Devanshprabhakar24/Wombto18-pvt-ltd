const mongoose = require('mongoose');

const treeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    treeId: { type: String, unique: true },
    type: { type: String, enum: ['dashboard_only', 'plantation'], required: true },
    geoLocation: {
        lat: { type: Number },
        lng: { type: Number },
        address: { type: String },
    },
    plantationDate: { type: Date },
    certificateUrl: { type: String },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    status: { type: String, enum: ['pending', 'planted', 'certified'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Tree', treeSchema);
