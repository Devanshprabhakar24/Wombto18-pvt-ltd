const ReminderLog = require('../models/ReminderLog');
const ChildProfile = require('../models/ChildProfile');
const reminderService = require('../services/reminderService');

// POST /api/reminders/send — send a reminder for a child's vaccine
exports.sendReminder = async (req, res, next) => {
    try {
        const { childId, vaccineName } = req.body;
        if (!childId || !vaccineName) {
            return res.status(400).json({ message: 'childId and vaccineName are required' });
        }
        await reminderService.sendReminder(childId, vaccineName);
        return res.status(200).json({ message: 'Reminder sent successfully' });
    } catch (error) {
        next(error);
    }
};

// GET /api/reminders/:childId — get reminder logs for a child
exports.getReminderLogs = async (req, res, next) => {
    try {
        const { childId } = req.params;
        const child = await ChildProfile.findOne({ _id: childId, parentId: req.user._id });
        if (!child) return res.status(404).json({ message: 'Child not found' });
        const logs = await ReminderLog.find({ childId }).sort({ timestamp: -1 });
        return res.status(200).json({ logs });
    } catch (error) {
        next(error);
    }
};
