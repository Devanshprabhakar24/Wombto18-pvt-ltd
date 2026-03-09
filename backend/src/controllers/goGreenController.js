const Tree = require('../models/Tree');
const User = require('../models/User');
const Payment = require('../models/Payment');

/**
 * POST /api/go-green/enroll — Enroll in Go Green (dashboard only or plantation)
 */
exports.enroll = async (req, res, next) => {
    try {
        const { type } = req.body;
        if (!type || !['dashboard_only', 'plantation'].includes(type)) {
            return res.status(400).json({ message: 'Type must be "dashboard_only" or "plantation".' });
        }

        const existing = await Tree.findOne({ userId: req.user._id });
        if (existing) return res.status(400).json({ message: 'Already enrolled in Go Green.' });

        const treeId = 'TREE-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();

        const tree = await Tree.create({
            userId: req.user._id,
            treeId,
            type,
            status: 'pending',
        });

        await User.findByIdAndUpdate(req.user._id, { is_tree_enrolled: true });

        res.status(201).json({ message: 'Enrolled in Go Green.', tree });
    } catch (error) {
        next(error);
    }
};


exports.recordPlantation = async (req, res, next) => {
    try {
        const { latitude, longitude, lat, lng, address, photoUrl } = req.body;
        const finalLat = latitude || lat;
        const finalLng = longitude || lng;
        if (!finalLat || !finalLng) {
            return res.status(400).json({ message: 'Latitude and longitude are required.' });
        }
        const tree = await Tree.findOne({ userId: req.user._id });
        if (!tree) return res.status(404).json({ message: 'No Go Green enrollment found.' });

        tree.geoLocation = { lat: Number(finalLat), lng: Number(finalLng), address: address || '' };
        tree.plantationDate = new Date();
        tree.status = 'planted';
        tree.certificateUrl = `/certificates/${tree.treeId}.pdf`;
        if (photoUrl) tree.photoUrl = photoUrl;
        await tree.save();

        res.status(200).json({ message: 'Plantation recorded.', tree });
    } catch (error) {
        next(error);
    }
};


exports.getStatus = async (req, res, next) => {
    try {
        const tree = await Tree.findOne({ userId: req.user._id });
        if (!tree) return res.status(200).json({ enrolled: false });

        const data = {
            enrolled: true,
            type: tree.type,
            tree: tree.status === 'planted' || tree.status === 'certified' ? {
                treeId: tree.treeId,
                latitude: tree.geoLocation?.lat || null,
                longitude: tree.geoLocation?.lng || null,
                address: tree.geoLocation?.address || '',
                plantationDate: tree.plantationDate,
                certificateUrl: tree.certificateUrl,
                status: tree.status,
                createdAt: tree.plantationDate || tree.createdAt,
            } : null,
        };
        res.status(200).json(data);
    } catch (error) {
        next(error);
    }
};


exports.listAll = async (req, res, next) => {
    try {
        const trees = await Tree.find().populate('userId', 'name email').sort({ createdAt: -1 });
        res.status(200).json({ trees });
    } catch (error) {
        next(error);
    }
};
