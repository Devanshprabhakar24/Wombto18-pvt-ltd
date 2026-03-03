const nodemailer = require('nodemailer');
const ReminderLog = require('../models/ReminderLog');
const ChildProfile = require('../models/ChildProfile');
const User = require('../models/User');

// Configure Nodemailer (use environment variables in production)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER || 'test@example.com',
        pass: process.env.SMTP_PASS || 'password',
    },
});

// Placeholder SMS function
async function sendSMS(phone, message) {
    // Simulate SMS sending
    return { success: true, info: 'SMS sent (placeholder)' };
}

/**
 * Send reminder via email and SMS, log all attempts
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
        // Log failed lookup
        await ReminderLog.create({
            childId,
            vaccineName,
            type: 'email',
            status: 'failed',
            timestamp: new Date(),
        });
        await ReminderLog.create({
            childId,
            vaccineName,
            type: 'sms',
            status: 'failed',
            timestamp: new Date(),
        });
        throw err;
    }

    // Send Email
    let emailStatus = 'sent';
    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM || 'noreply@wombto18.com',
            to: parent.email,
            subject: `Vaccine Reminder: ${vaccineName}`,
            text: `Dear ${parent.name},\nYour child ${child.name} is due for the ${vaccineName} vaccine.`,
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

    // Send SMS (placeholder)
    let smsStatus = 'sent';
    try {
        const smsResult = await sendSMS(parent.phone, `Vaccine Reminder: ${vaccineName}`);
        if (!smsResult.success) throw new Error('SMS failed');
    } catch (err) {
        smsStatus = 'failed';
    }
    await ReminderLog.create({
        childId,
        vaccineName,
        type: 'sms',
        status: smsStatus,
        timestamp: new Date(),
    });
}

module.exports = {
    sendReminder,
};