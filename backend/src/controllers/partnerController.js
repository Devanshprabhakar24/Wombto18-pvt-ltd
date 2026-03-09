const Partner = require('../models/Partner');
const User = require('../models/User');

/**
 * POST /api/partners/register — Register a new partner
 */
exports.registerPartner = async (req, res, next) => {
    try {
        const { name, type, email, phone } = req.body;
        if (!name || !type || !email) {
            return res.status(400).json({ message: 'Name, type, and email are required.' });
        }

        const referralId = type.substring(0, 3).toUpperCase() + Math.random().toString(36).substr(2, 5).toUpperCase();

        const partner = await Partner.create({ name, type, email, phone, referralId });
        res.status(201).json({
            message: 'Partner registered.',
            partner,
            qrUrl: `wombto18.com/register?ref=${referralId}`,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/partners/:referralId/dashboard — Partner referral dashboard
 */
exports.getPartnerDashboard = async (req, res, next) => {
    try {
        const partner = await Partner.findOne({ referralId: req.params.referralId });
        if (!partner) return res.status(404).json({ message: 'Partner not found.' });

        const referrals = await User.find({ partnerId: partner._id })
            .select('name state maternal_status plan_type createdAt')
            .sort({ createdAt: -1 });

        res.status(200).json({
            partner: { name: partner.name, type: partner.type, referralId: partner.referralId, totalReferrals: partner.totalReferrals },
            referrals: referrals.map(r => ({
                name: r.name,
                state: r.state,
                status: r.maternal_status,
                plan: r.plan_type,
                registeredAt: r.createdAt,
            })),
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/partners — List all partners (admin)
 */
exports.listPartners = async (req, res, next) => {
    try {
        const partners = await Partner.find().sort({ createdAt: -1 });
        res.status(200).json({ partners });
    } catch (error) {
        next(error);
    }
};
