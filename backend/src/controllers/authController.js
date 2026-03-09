const User = require('../models/User');
const Role = require('../models/Role');
const ChildProfile = require('../models/ChildProfile');
const MaternalProfile = require('../models/MaternalProfile');
const Partner = require('../models/Partner');
const { calculateMaternalSchedule, generateMRN } = require('../services/maternalService');
const emailService = require('../services/emailService');

/**
 * Register a new parent and their child profile (or maternal profile if expecting)
 * POST /api/auth/register
 */
exports.register = async (req, res, next) => {
    try {
        const { mother, child, maternal, consent, ref } = req.body;

        if (!mother || !consent) {
            return res.status(400).json({ message: 'Mother details and consent are required.' });
        }
        if (!mother.name || !mother.email || !mother.phone || !mother.password) {
            return res.status(400).json({ message: 'Mother name, email, phone, and password are required.' });
        }

        const isExpecting = maternal && maternal.edd;
        if (!isExpecting && (!child || !child.name || !child.dob)) {
            return res.status(400).json({ message: 'Child name and dob are required.' });
        }

        // Check duplicate mobile
        const existingPhone = await User.findOne({ phone: mother.phone });
        if (existingPhone) {
            return res.status(400).json({ message: 'Phone number already registered.' });
        }

        const existingUser = await User.findOne({ email: mother.email });
        if (existingUser) {
            return res.status(400).json({ message: 'Parent already registered with this email.' });
        }

        let parentRole = await Role.findOne({ name: 'parent' });
        if (!parentRole) {
            parentRole = await Role.create({ name: 'parent', description: 'Parent role' });
        }

        // Handle partner referral
        let partnerId;
        if (ref) {
            const partner = await Partner.findOne({ referralId: ref, isActive: true });
            if (partner) {
                partnerId = partner._id;
                partner.totalReferrals += 1;
                await partner.save();
            }
        }

        const parent = new User({
            name: mother.name,
            email: mother.email,
            phone: mother.phone,
            password: mother.password,
            state: mother.state || '',
            role: parentRole._id,
            plan_type: mother.plan_type || 'FREE',
            maternal_status: isExpecting ? 'ACTIVE' : 'NONE',
            partnerId,
        });
        await parent.save();

        const token = parent.generateToken();
        const responseData = {
            message: isExpecting
                ? 'Parent registered with maternal profile.'
                : 'Parent and child registered successfully.',
            token,
            user: {
                id: parent._id,
                name: parent.name,
                email: parent.email,
                role: parentRole.name,
                plan_type: parent.plan_type,
                maternal_status: parent.maternal_status,
            },
        };

        if (isExpecting) {
            // Create maternal profile
            const eddDate = new Date(maternal.edd);
            const count = await MaternalProfile.countDocuments();
            const mrn = generateMRN(parent.state, count + 1);
            const schedule = calculateMaternalSchedule(maternal.edd, parent.state);

            await MaternalProfile.create({
                userId: parent._id,
                mrn,
                edd: eddDate,
                lmp: schedule.lmp,
                state: parent.state,
                vaccineSchedule: schedule.vaccines.map(v => ({
                    name: v.name,
                    category: v.category,
                    dueDate: v.dueDate,
                    status: v.status,
                })),
            });
            responseData.mrn = mrn;
        } else {
            // Create child profile
            const childProfile = new ChildProfile({
                parentId: parent._id,
                name: child.name,
                dob: child.dob,
                gender: child.gender,
                birthHospital: child.birthHospital || '',
            });
            await childProfile.save();
            responseData.childId = childProfile._id;
        }

        // Send welcome email (fire & forget)
        emailService.sendMail({
            to: parent.email,
            subject: 'Welcome to WombTo18! 🎉',
            html: `<h2>Hello ${parent.name},</h2>
<p>Welcome to <strong>WombTo18</strong> – your trusted companion for maternal & child health tracking.</p>
<p>Here's what you can do:</p>
<ul>
  <li>📋 Track vaccines & ANC visits</li>
  <li>🔔 Get reminders 2 days before every event</li>
  <li>🌿 Join the Go-Green cohort</li>
</ul>
<p>Stay healthy, stay on track!</p>
<p>– Team WombTo18</p>`,
        }).catch(() => { });

        return res.status(201).json(responseData);
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/auth/login
 */
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }
        const user = await User.findOne({ email }).populate('role');
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const token = user.generateToken();
        const roleName = user.role?.name || 'parent';

        // Send welcome-back email (fire & forget)
        emailService.sendMail({
            to: user.email,
            subject: 'Welcome back to WombTo18!',
            html: `<h2>Hi ${user.name},</h2>
<p>You've just logged in to <strong>WombTo18</strong>.</p>
<p>Check your dashboard for upcoming vaccines, reminders, and health updates.</p>
<p>– Team WombTo18</p>`,
        }).catch(() => { });

        return res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: roleName,
                plan_type: user.plan_type,
                maternal_status: user.maternal_status,
                is_tree_enrolled: user.is_tree_enrolled,
            },
        });
    } catch (error) {
        next(error);
    }
};

// In-memory OTP store (test mode)
const otpStore = new Map();

/**
 * POST /api/auth/send-otp — Send OTP to user's email
 * Test mode: OTP is always 123456
 */
exports.sendOtp = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'No account found with this email.' });
        }

        // Test mode: fixed 6-digit OTP, no email sent
        otpStore.set(email, { otp: '123456', expiresAt: Date.now() + 5 * 60 * 1000 });

        return res.status(200).json({ message: 'OTP sent to your email.' });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/auth/verify-otp — Verify OTP and log in
 */
exports.verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required.' });
        }

        // Test mode: always accept 123456
        if (otp !== '123456') {
            return res.status(401).json({ message: 'Invalid OTP.' });
        }

        otpStore.delete(email);

        const user = await User.findOne({ email }).populate('role');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const roleName = user.role?.name || 'parent';

        // If admin, require additional password verification
        if (roleName === 'admin') {
            return res.status(200).json({
                requireAdminVerify: true,
                email: user.email,
                message: 'Admin detected. Please enter your admin password.',
            });
        }

        const token = user.generateToken();

        return res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: roleName,
                plan_type: user.plan_type,
                maternal_status: user.maternal_status,
                is_tree_enrolled: user.is_tree_enrolled,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * POST /api/auth/admin-verify — Admin password verification after OTP
 */
exports.adminVerify = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const user = await User.findOne({ email }).populate('role');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const roleName = user.role?.name || 'parent';
        if (roleName !== 'admin') {
            return res.status(403).json({ message: 'Not an admin account.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid admin password.' });
        }

        const token = user.generateToken();

        return res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: roleName,
                plan_type: user.plan_type,
                maternal_status: user.maternal_status,
                is_tree_enrolled: user.is_tree_enrolled,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get current user profile
 * GET /api/auth/me
 */
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('-password').populate('role');
        if (!user) return res.status(404).json({ message: 'User not found' });
        const children = await ChildProfile.find({ parentId: user._id });
        return res.status(200).json({ user, children });
    } catch (error) {
        next(error);
    }
};
