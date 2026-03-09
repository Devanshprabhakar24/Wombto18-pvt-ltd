const MaternalProfile = require('../models/MaternalProfile');
const ChildProfile = require('../models/ChildProfile');
const User = require('../models/User');
const { calculateMaternalSchedule, generateMRN, generateCRN } = require('../services/maternalService');

/**
 * POST /api/maternal/register — Register maternal profile
 */
exports.registerMaternal = async (req, res, next) => {
    try {
        const { edd, lmp, bloodGroup, weight, height, gravida, para, highRisk } = req.body;
        if (!edd) return res.status(400).json({ message: 'EDD is required.' });

        const eddDate = new Date(edd);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (eddDate < today) {
            return res.status(400).json({ message: 'EDD must be today or a future date.' });
        }

        // Use user-provided LMP if given, otherwise auto-calculate from EDD
        const lmpDate = lmp ? new Date(lmp) : null;

        const existing = await MaternalProfile.findOne({ userId: req.user._id });
        if (existing) return res.status(400).json({ message: 'Maternal profile already exists.' });

        const user = await User.findById(req.user._id);
        const count = await MaternalProfile.countDocuments();
        const mrn = generateMRN(user.state, count + 1);

        const schedule = calculateMaternalSchedule(edd, user.state);

        const profile = await MaternalProfile.create({
            userId: req.user._id,
            mrn,
            edd: eddDate,
            lmp: lmpDate || schedule.lmp,
            state: user.state,
            bloodGroup: bloodGroup || '',
            weight: weight || '',
            height: height || '',
            gravida: gravida ? Number(gravida) : undefined,
            para: para ? Number(para) : undefined,
            highRisk: highRisk || false,
            vaccineSchedule: schedule.vaccines.map(v => ({
                name: v.name,
                category: v.category,
                dueDate: v.dueDate,
                status: v.status,
            })),
        });

        await User.findByIdAndUpdate(req.user._id, { maternal_status: 'ACTIVE' });

        res.status(201).json({ message: 'Maternal profile created.', profile, mrn });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/maternal/profile — Get maternal profile & schedule
 */
exports.getProfile = async (req, res, next) => {
    try {
        const profile = await MaternalProfile.findOne({ userId: req.user._id });
        if (!profile) return res.status(404).json({ message: 'No maternal profile found.' });

        // Auto-upgrade old schedules that lack the `category` field
        const needsUpgrade = profile.vaccineSchedule.some(v => !v.category);
        if (needsUpgrade && profile.edd) {
            const schedule = calculateMaternalSchedule(profile.edd, profile.state);
            // Preserve completed statuses from existing data
            const completedMap = new Map();
            profile.vaccineSchedule.forEach(v => {
                if (v.status === 'completed') completedMap.set(v.name, v.completedDate);
            });
            profile.vaccineSchedule = schedule.vaccines.map(v => ({
                name: v.name,
                category: v.category,
                dueDate: v.dueDate,
                status: completedMap.has(v.name) ? 'completed' : v.status,
                completedDate: completedMap.get(v.name) || undefined,
            }));
            await profile.save();
        }

        const user = await User.findById(req.user._id).select('plan_type name');
        const isFree = user.plan_type === 'FREE';

        // For free users: show summary data (EDD, LMP, status, info) but mask vaccine schedule details
        const data = profile.toObject();
        if (isFree) {
            data.vaccineSchedule = data.vaccineSchedule.map(v => ({
                ...v,
                dueDate: null,
                masked: true,
            }));
        }

        res.status(200).json({ profile: data, plan_type: user.plan_type });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/maternal/mark-vaccine — Mark maternal vaccine as completed
 */
exports.markVaccineComplete = async (req, res, next) => {
    try {
        const { vaccineName } = req.body;
        const user = await User.findById(req.user._id).select('plan_type');
        if (user.plan_type === 'FREE') {
            return res.status(403).json({ message: 'Upgrade your plan to mark vaccines.' });
        }

        const profile = await MaternalProfile.findOne({ userId: req.user._id });
        if (!profile) return res.status(404).json({ message: 'No maternal profile found.' });

        const vaccine = profile.vaccineSchedule.find(v => v.name === vaccineName);
        if (!vaccine) return res.status(404).json({ message: 'Vaccine not found in schedule.' });

        vaccine.status = 'completed';
        vaccine.completedDate = new Date();
        await profile.save();

        res.status(200).json({ message: 'Vaccine marked as completed.', profile });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/maternal/migrate — Migrate maternal → child profile
 */
exports.migrateToChild = async (req, res, next) => {
    try {
        const profile = await MaternalProfile.findOne({ userId: req.user._id });
        if (!profile) return res.status(404).json({ message: 'No maternal profile found.' });

        if (profile.maternal_status === 'MIGRATED') {
            return res.status(400).json({ message: 'Already migrated to child profile.' });
        }

        const { childName, dob, gender, birthWeight, bloodGroup, apgarScore, birthHospital } = req.body;
        if (!childName || !dob) {
            return res.status(400).json({ message: 'Child name and date of birth are required.' });
        }

        // Check if a child already exists for this parent to prevent duplicates
        const existingChild = await ChildProfile.findOne({ parentId: req.user._id, name: childName });
        if (existingChild) {
            // Link existing child instead of creating duplicate
            profile.maternal_status = 'MIGRATED';
            profile.deliveryDate = new Date(dob);
            profile.linkedChildCRN = existingChild.crn || '';
            await profile.save();
            await User.findByIdAndUpdate(req.user._id, { maternal_status: 'DELIVERED' });
            return res.status(200).json({
                message: 'Maternal profile linked to existing child.',
                child: existingChild,
                crn: existingChild.crn || '',
                mrn: profile.mrn,
            });
        }

        const user = await User.findById(req.user._id);
        const childCount = await ChildProfile.countDocuments();
        const crn = generateCRN(user.state, childCount + 1);

        const child = await ChildProfile.create({
            parentId: req.user._id,
            crn,
            mrn_linked: profile.mrn,
            name: childName,
            dob: new Date(dob),
            gender,
            birthWeight,
            bloodGroup,
            apgarScore: apgarScore ? Number(apgarScore) : undefined,
            birthHospital: birthHospital || '',
            migratedFromMaternal: true,
        });

        // Update maternal profile
        profile.maternal_status = 'MIGRATED';
        profile.deliveryDate = new Date(dob);
        profile.linkedChildCRN = crn;
        await profile.save();

        // Update user status
        await User.findByIdAndUpdate(req.user._id, { maternal_status: 'DELIVERED' });

        res.status(201).json({
            message: 'Successfully migrated to child profile.',
            child,
            crn,
            mrn: profile.mrn,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/maternal/delivery — Record delivery date
 */
exports.recordDelivery = async (req, res, next) => {
    try {
        const { deliveryDate } = req.body;
        const profile = await MaternalProfile.findOne({ userId: req.user._id });
        if (!profile) return res.status(404).json({ message: 'No maternal profile found.' });

        profile.deliveryDate = new Date(deliveryDate || Date.now());
        profile.maternal_status = 'DELIVERED';
        await profile.save();

        await User.findByIdAndUpdate(req.user._id, { maternal_status: 'DELIVERED' });

        res.status(200).json({ message: 'Delivery recorded. You can now migrate to child profile.', profile });
    } catch (error) {
        next(error);
    }
};
