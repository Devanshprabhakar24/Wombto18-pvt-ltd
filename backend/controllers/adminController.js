const User = require('../models/User');
const ReminderLog = require('../models/ReminderLog');
const { Parser } = require('json2csv');

// GET /api/admin/parents (with pagination)
exports.getParents = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const total = await User.countDocuments({ role: 'parent' });
        const parents = await User.find({ role: 'parent' }).skip(skip).limit(limit).sort({ createdAt: -1 });
        res.status(200).json({ parents, page, limit, total, totalPages: Math.ceil(total / limit) });
    } catch (err) {
        next(err);
    }
};

// GET /api/admin/export-csv
exports.exportParentsCSV = async (req, res, next) => {
    try {
        const parents = await User.find({ role: 'parent' }).lean();
        const fields = ['_id', 'name', 'email', 'phone', 'createdAt'];
        const parser = new Parser({ fields });
        const csv = parser.parse(parents);
        res.header('Content-Type', 'text/csv');
        res.attachment('parents.csv');
        res.status(200).send(csv);
    } catch (err) {
        next(err);
    }
};

// PATCH /api/admin/reminder-status/:id
exports.updateReminderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!['sent', 'failed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const log = await ReminderLog.findByIdAndUpdate(id, { status }, { new: true });
        if (!log) {
            return res.status(404).json({ message: 'Reminder log not found' });
        }
        res.status(200).json(log);
    } catch (err) {
        next(err);
    }
};