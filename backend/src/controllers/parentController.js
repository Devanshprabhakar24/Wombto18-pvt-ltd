const User = require('../models/User');
const ChildProfile = require('../models/ChildProfile');

/**
 * Get current parent profile with children
 * GET /api/parents/me
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

/**
 * Update parent profile
 * PUT /api/parents/me
 */
exports.updateProfile = async (req, res, next) => {
    try {
        const { name, phone, state } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, phone, state },
            { new: true, runValidators: true }
        ).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        return res.status(200).json({ user });
    } catch (error) {
        next(error);
    }
};
