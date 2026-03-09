const ChildProfile = require('../models/ChildProfile');
const Tree = require('../models/Tree');
const { indianVaccineSchedule } = require('../services/vaccineService');

exports.getImpact = async (req, res, next) => {
    try {
        const children = await ChildProfile.find({ parentId: req.user._id });
        const trees = await Tree.countDocuments({ userId: req.user._id });

        let totalCompleted = 0;
        let totalDue = 0;

        children.forEach(child => {
            const ageWeeks = Math.floor((Date.now() - new Date(child.dob)) / (7 * 24 * 60 * 60 * 1000));
            const due = indianVaccineSchedule.filter(v => v.dueAgeWeeks <= ageWeeks);
            totalDue += due.length;
            totalCompleted += due.filter(v => (child.completedVaccines || []).includes(v.name)).length;
        });

        const score = totalDue > 0 ? Math.round((totalCompleted / totalDue) * 100) : 0;
        const level = score >= 90 ? 'Gold' : score >= 70 ? 'Silver' : 'Bronze';

        res.json({
            impact: {
                impactScore: score,
                sustainabilityLevel: level,
                treeCount: trees,
                totalCompleted,
                totalDue,
                childCount: children.length,
            },
        });
    } catch (err) {
        next(err);
    }
};
