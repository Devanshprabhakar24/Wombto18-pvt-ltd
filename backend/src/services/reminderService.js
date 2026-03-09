const ReminderLog = require('../models/ReminderLog');
const ChildProfile = require('../models/ChildProfile');
const User = require('../models/User');
const emailService = require('./emailService');

/**
 * Send email reminder for a specific vaccine, log the attempt
 * @param {String} childId
 * @param {String} vaccineName
 */
async function sendReminder(childId, vaccineName) {
    let child, parent;
    try {
        child = await ChildProfile.findById(childId);
        if (!child) throw new Error('Child not found');
        parent = await User.findById(child.parentId);
        if (!parent) throw new Error('Parent not found');
    } catch (err) {
        await ReminderLog.create({
            childId,
            vaccineName,
            type: 'email',
            status: 'failed',
            timestamp: new Date(),
        });
        throw err;
    }

    let emailStatus = 'sent';
    try {
        await emailService.sendMail({
            to: parent.email,
            subject: `Vaccine Reminder: ${vaccineName}`,
            text: `Dear ${parent.name},\nYour child ${child.name} is due for the ${vaccineName} vaccine. Please schedule the vaccination soon.`,
        });
    } catch (err) {
        emailStatus = 'failed';
    }
    await ReminderLog.create({
        childId,
        vaccineName,
        type: 'email',
        status: emailStatus,
        timestamp: new Date(),
    });
}

module.exports = { sendReminder };
