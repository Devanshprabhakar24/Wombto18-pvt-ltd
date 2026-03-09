const ChildProfile = require('../models/ChildProfile');
const MaternalProfile = require('../models/MaternalProfile');
const User = require('../models/User');
const ReminderLog = require('../models/ReminderLog');
const vaccineService = require('../services/vaccineService');
const emailService = require('../services/emailService');
const logger = require('../utils/logger');

const DAY = 24 * 60 * 60 * 1000;
const REMIND_BEFORE_DAYS = 2; // send reminder 2 days before the event


function isDaysAway(dueDate, days) {
    const now = new Date();
    const target = new Date(now.getTime() + days * DAY);
    // Compare calendar dates only
    return (
        target.getFullYear() === dueDate.getFullYear() &&
        target.getMonth() === dueDate.getMonth() &&
        target.getDate() === dueDate.getDate()
    );
}


async function alreadySent(entityId, vaccineName) {
    const cutoff = new Date(Date.now() - DAY);
    const existing = await ReminderLog.findOne({
        childId: entityId,
        vaccineName,
        status: 'sent',
        timestamp: { $gte: cutoff },
    });
    return !!existing;
}

/**
 * Send an email reminder and log it.
 */
async function sendAndLog(entityId, vaccineName, parentEmail, parentName, entityName, type) {
    if (await alreadySent(entityId, vaccineName)) return false;

    let status = 'sent';
    try {
        const label = type === 'maternal' ? 'maternal care item' : 'vaccine';
        await emailService.sendMail({
            to: parentEmail,
            subject: `Reminder: ${vaccineName} in 2 days`,
            text: `Dear ${parentName},\n\n` +
                (type === 'maternal'
                    ? `Your ${label} "${vaccineName}" is due in 2 days. Please make the necessary arrangements.`
                    : `Your child ${entityName}'s ${label} "${vaccineName}" is due in 2 days. Please schedule accordingly.`) +
                `\n\nTeam WombTo18`,
        });
    } catch {
        status = 'failed';
    }

    await ReminderLog.create({
        childId: entityId,
        vaccineName,
        type: 'email',
        status,
        timestamp: new Date(),
    });
    return status === 'sent';
}


async function checkAndSendReminders() {
    try {
        let sent = 0;

        // --- Child vaccine reminders ---
        const children = await ChildProfile.find({});
        for (const child of children) {
            if (!child.dob) continue;
            const parent = await User.findById(child.parentId);
            if (!parent || !parent.email) continue;

            const { schedule } = vaccineService.getFullSchedule(child.dob, child.completedVaccines || []);
            for (const v of schedule) {
                if (v.status === 'completed') continue;
                const dueDate = new Date(v.dueDate);
                if (isDaysAway(dueDate, REMIND_BEFORE_DAYS)) {
                    const ok = await sendAndLog(child._id, v.name, parent.email, parent.name, child.name, 'child');
                    if (ok) sent++;
                }
            }
        }

        // --- Maternal schedule reminders ---
        const maternalProfiles = await MaternalProfile.find({ maternal_status: 'ACTIVE' });
        for (const mp of maternalProfiles) {
            const parent = await User.findById(mp.userId);
            if (!parent || !parent.email) continue;

            for (const v of mp.vaccineSchedule) {
                if (v.status === 'completed') continue;
                const dueDate = new Date(v.dueDate);
                if (isDaysAway(dueDate, REMIND_BEFORE_DAYS)) {
                    const ok = await sendAndLog(mp._id, v.name, parent.email, parent.name, parent.name, 'maternal');
                    if (ok) sent++;
                }
            }
        }

        logger.info(`Reminder scheduler: sent ${sent} reminders (2-day advance)`);
    } catch (err) {
        logger.error(`Reminder scheduler error: ${err.message}`);
    }
}


function startReminderScheduler() {
    logger.info('Reminder scheduler started (runs every 24 hours, 2-day advance reminders)');

    setTimeout(() => {
        checkAndSendReminders();
    }, 10000);

    setInterval(() => {
        checkAndSendReminders();
    }, 24 * 60 * 60 * 1000);
}

module.exports = { startReminderScheduler, checkAndSendReminders };
