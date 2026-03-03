const ChildProfile = require('../models/ChildProfile');

// GET /api/children — all children for logged-in parent
exports.getChildren = async (req, res, next) => {
    try {
        const children = await ChildProfile.find({ parentId: req.user._id }).sort({ createdAt: -1 });
        return res.status(200).json({ children });
    } catch (error) {
        next(error);
    }
};

// GET /api/children/:id — single child
exports.getChild = async (req, res, next) => {
    try {
        const child = await ChildProfile.findOne({ _id: req.params.id, parentId: req.user._id });
        if (!child) return res.status(404).json({ message: 'Child not found' });
        return res.status(200).json({ child });
    } catch (error) {
        next(error);
    }
};

// POST /api/children — add another child
exports.addChild = async (req, res, next) => {
    try {
        const { name, dob, gender, birthHospital } = req.body;
        if (!name || !dob) return res.status(400).json({ message: 'Name and DOB are required' });
        const child = new ChildProfile({
            parentId: req.user._id,
            name,
            dob,
            gender,
            birthHospital: birthHospital || '',
        });
        await child.save();
        return res.status(201).json({ message: 'Child added', child });
    } catch (error) {
        next(error);
    }
};

// PUT /api/children/:id — update child
exports.updateChild = async (req, res, next) => {
    try {
        const { name, dob, gender, birthHospital } = req.body;
        const child = await ChildProfile.findOneAndUpdate(
            { _id: req.params.id, parentId: req.user._id },
            { name, dob, gender, birthHospital },
            { new: true, runValidators: true }
        );
        if (!child) return res.status(404).json({ message: 'Child not found' });
        return res.status(200).json({ message: 'Child updated', child });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/children/:id — remove child
exports.deleteChild = async (req, res, next) => {
    try {
        const child = await ChildProfile.findOneAndDelete({ _id: req.params.id, parentId: req.user._id });
        if (!child) return res.status(404).json({ message: 'Child not found' });
        return res.status(200).json({ message: 'Child deleted' });
    } catch (error) {
        next(error);
    }
};
