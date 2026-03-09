const User = require('../models/User');
const Role = require('../models/Role');
const ReminderLog = require('../models/ReminderLog');
const ChildProfile = require('../models/ChildProfile');
const ChildVaccination = require('../models/ChildVaccination');
const ActivityLog = require('../models/ActivityLog');
const MaternalProfile = require('../models/MaternalProfile');
const Payment = require('../models/Payment');
const Coupon = require('../models/Coupon');
const Partner = require('../models/Partner');
const Tree = require('../models/Tree');
const { Parser } = require('json2csv');

// GET /api/admin/stats — dashboard overview numbers
exports.getStats = async (req, res, next) => {
    try {
        const parentRole = await Role.findOne({ name: 'parent' });
        const parentCount = parentRole ? await User.countDocuments({ role: parentRole._id }) : 0;
        const childCount = await ChildProfile.countDocuments();
        const vaccinesDone = await ChildVaccination.countDocuments({ status: 'completed' });
        const reminderCount = await ReminderLog.countDocuments();
        const remindersSent = await ReminderLog.countDocuments({ status: 'sent' });
        const remindersFailed = await ReminderLog.countDocuments({ status: 'failed' });
        res.status(200).json({ parentCount, childCount, vaccinesDone, reminderCount, remindersSent, remindersFailed });
    } catch (err) {
        next(err);
    }
};

// GET /api/admin/children — list all children with parent info
exports.getChildren = async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
        const skip = (page - 1) * limit;
        const total = await ChildProfile.countDocuments();
        const children = await ChildProfile.find()
            .populate('parentId', 'name email phone')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        res.status(200).json({ children, page, limit, total, totalPages: Math.ceil(total / limit) });
    } catch (err) {
        next(err);
    }
};

// GET /api/admin/parents (with pagination)
exports.getParents = async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
        const skip = (page - 1) * limit;

        const parentRole = await Role.findOne({ name: 'parent' });
        if (!parentRole) {
            return res.status(200).json({ parents: [], page, limit, total: 0, totalPages: 0 });
        }

        const total = await User.countDocuments({ role: parentRole._id });
        const parents = await User.find({ role: parentRole._id })
            .populate('role')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .select('-password');

        res.status(200).json({ parents, page, limit, total, totalPages: Math.ceil(total / limit) });
    } catch (err) {
        next(err);
    }
};

// GET /api/admin/export-csv
exports.exportParentsCSV = async (req, res, next) => {
    try {
        const parentRole = await Role.findOne({ name: 'parent' });
        const filtered = parentRole
            ? await User.find({ role: parentRole._id }).populate('role').lean()
            : [];
        // Prefix phone with apostrophe so Excel treats it as text, not a number
        const rows = filtered.map(u => ({
            _id: u._id,
            name: u.name,
            email: u.email,
            phone: u.phone ? `\t${u.phone}` : '',
            createdAt: u.createdAt,
        }));
        const fields = ['_id', 'name', 'email', 'phone', 'createdAt'];
        const parser = new Parser({ fields });
        const csv = parser.parse(rows);
        res.header('Content-Type', 'text/csv');
        res.attachment('parents.csv');
        res.status(200).send(csv);
    } catch (err) {
        next(err);
    }
};

// GET /api/admin/reminder-logs (with pagination)
exports.getReminderLogs = async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
        const skip = (page - 1) * limit;
        const total = await ReminderLog.countDocuments();
        const logs = await ReminderLog.find()
            .populate({ path: 'childId', select: 'name parentId', populate: { path: 'parentId', select: 'name' } })
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit);
        res.status(200).json({ logs, page, limit, total, totalPages: Math.ceil(total / limit) });
    } catch (err) {
        next(err);
    }
};

// PATCH /api/admin/reminder-status/:id
exports.updateReminderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
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

// POST /api/admin/send-reminder — send email reminder for next vaccine to all parents
exports.sendManualReminder = async (req, res, next) => {
    try {
        const vaccineService = require('../services/vaccineService');
        const emailService = require('../services/emailService');
        const children = await ChildProfile.find({}).populate('parentId', 'name email');
        let count = 0;
        for (const child of children) {
            if (!child.parentId || !child.parentId.email || !child.dob) continue;
            const { schedule } = vaccineService.getFullSchedule(child.dob, child.completedVaccines || []);
            const nextVaccine = schedule.find(v => v.status === 'upcoming' || v.status === 'overdue');
            if (!nextVaccine) continue;

            let emailStatus = 'sent';
            try {
                await emailService.sendMail({
                    to: child.parentId.email,
                    subject: `Vaccine Reminder: ${nextVaccine.name}`,
                    text: `Dear ${child.parentId.name},\nYour child ${child.name} is due for the ${nextVaccine.name} vaccine (${nextVaccine.description}). Please schedule the vaccination soon.`,
                });
            } catch {
                emailStatus = 'failed';
            }
            await ReminderLog.create({
                childId: child._id,
                vaccineName: nextVaccine.name,
                type: 'email',
                status: emailStatus,
                timestamp: new Date(),
            });
            count++;
        }
        res.status(200).json({ message: 'Email reminders sent for next vaccine', count });
    } catch (err) {
        next(err);
    }
};

exports.getActivityLogs = async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
        const skip = (page - 1) * limit;
        const total = await ActivityLog.countDocuments();
        const logs = await ActivityLog.find()

            .populate('userId', 'name email')
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit);
        res.status(200).json({ logs, page, limit, total, totalPages: Math.ceil(total / limit) });
    } catch (err) {
        next(err);
    }
};

// GET /api/admin/enhanced-stats — Full admin stats
exports.getEnhancedStats = async (req, res, next) => {
    try {
        const parentRole = await Role.findOne({ name: 'parent' });
        const parentCount = parentRole ? await User.countDocuments({ role: parentRole._id }) : 0;
        const childCount = await ChildProfile.countDocuments();
        const maternalCount = await MaternalProfile.countDocuments();
        const activeMaternal = await MaternalProfile.countDocuments({ maternal_status: 'ACTIVE' });
        const migratedCount = await MaternalProfile.countDocuments({ maternal_status: 'MIGRATED' });
        const paymentCount = await Payment.countDocuments({ status: 'paid' });
        const totalRevenue = await Payment.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]);
        const partnerCount = await Partner.countDocuments();
        const treeCount = await Tree.countDocuments();
        const plantedTrees = await Tree.countDocuments({ status: 'planted' });
        const premiumUsers = await User.countDocuments({ plan_type: 'PREMIUM' });
        const ultraUsers = await User.countDocuments({ plan_type: 'ULTRA' });
        const freeUsers = await User.countDocuments({ plan_type: 'FREE' });

        res.status(200).json({
            parentCount, childCount, maternalCount, activeMaternal, migratedCount,
            paymentCount, totalRevenue: totalRevenue[0]?.total || 0,
            partnerCount, treeCount, plantedTrees,
            premiumUsers, ultraUsers, freeUsers,
        });
    } catch (err) {
        next(err);
    }
};

// COUPON MANAGEMENT 
exports.createCoupon = async (req, res, next) => {
    try {
        const { code, type, value, applicablePlans, maxUses, expiresAt } = req.body;
        if (!code || !type) return res.status(400).json({ message: 'Code and type are required.' });
        const coupon = await Coupon.create({ code: code.toUpperCase(), type, value, applicablePlans, maxUses, expiresAt });
        res.status(201).json({ coupon });
    } catch (err) {
        next(err);
    }
};

exports.listCoupons = async (req, res, next) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.status(200).json({ coupons });
    } catch (err) {
        next(err);
    }
};

exports.deleteCoupon = async (req, res, next) => {
    try {
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) return res.status(404).json({ message: 'Coupon not found.' });
        res.status(200).json({ message: 'Coupon deleted.' });
    } catch (err) {
        next(err);
    }
};

// PAYMENT 
exports.getPaymentLogs = async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
        const skip = (page - 1) * limit;
        const total = await Payment.countDocuments();
        const payments = await Payment.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        res.status(200).json({ payments, page, limit, total, totalPages: Math.ceil(total / limit) });
    } catch (err) {
        next(err);
    }
};

// MANUAL PLAN UPGRADE 
exports.manualUpgrade = async (req, res, next) => {
    try {
        const { userId, plan } = req.body;
        if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: 'Invalid user ID.' });
        }
        if (!['FREE', 'PREMIUM', 'ULTRA'].includes(plan)) {
            return res.status(400).json({ message: 'Invalid plan.' });
        }
        const user = await User.findByIdAndUpdate(userId, { plan_type: plan }, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found.' });
        res.status(200).json({ message: `User upgraded to ${plan}.` });
    } catch (err) {
        next(err);
    }
};
