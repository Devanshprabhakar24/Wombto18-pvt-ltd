const User = require('../models/User');
const ChildProfile = require('../models/ChildProfile');

/**
 * Register a new parent and their child profile
 * POST /api/parents/register
 */
exports.registerParent = async (req, res, next) => {
    try {
        const { mother, child, consent } = req.body;

        if (!mother || !child || !consent) {
            return res.status(400).json({ message: 'Mother, child, and consent are required.' });
        }
        if (!mother.name || !mother.email || !mother.phone || !mother.password) {
            return res.status(400).json({ message: 'Mother name, email, phone, and password are required.' });
        }
        if (!child.name || !child.dob) {
            return res.status(400).json({ message: 'Child name and dob are required.' });
        }

        const existingUser = await User.findOne({ email: mother.email });
        if (existingUser) {
            return res.status(400).json({ message: 'Parent already registered with this email.' });
        }

        const parent = new User({
            name: mother.name,
            email: mother.email,
            phone: mother.phone,
            password: mother.password,
            state: mother.state || '',
            role: 'parent',
        });
        await parent.save();

        const childProfile = new ChildProfile({
            parentId: parent._id,
            name: child.name,
            dob: child.dob,
            gender: child.gender,
            birthHospital: child.birthHospital || '',
        });
        await childProfile.save();

        const token = parent.generateToken();

        return res.status(201).json({
            message: 'Parent and child registered successfully.',
            token,
            user: { id: parent._id, name: parent.name, email: parent.email, role: parent.role },
            childId: childProfile._id,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Login parent
 * POST /api/parents/login
 */
exports.loginParent = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        const token = user.generateToken();
        return res.status(200).json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get current user profile
 * GET /api/parents/me
 */
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        const children = await ChildProfile.find({ parentId: user._id });
        return res.status(200).json({ user, children });
    } catch (error) {
        next(error);
    }
};
