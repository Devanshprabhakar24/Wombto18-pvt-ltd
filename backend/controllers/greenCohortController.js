const GreenCohortImpact = require('../models/GreenCohortImpact');
const ChildProfile = require('../models/ChildProfile');
const { indianVaccineSchedule } = require('../utils/vaccineUtils');

/**
 * Compute impact score based on completed vaccines
 */
function computeImpact(children) {
    let totalCompleted = 0;
    let totalPossible = 0;
    children.forEach(child => {
        const dob = new Date(child.dob);
        const now = new Date();
        const msPerWeek = 1000 * 60 * 60 * 24 * 7;
        const ageWeeks = Math.floor((now - dob) / msPerWeek);
        const dueVaccines = indianVaccineSchedule.filter(v => v.dueAgeWeeks <= ageWeeks);
        totalPossible += dueVaccines.length;
        const completed = child.completedVaccines || [];
        totalCompleted += dueVaccines.filter(v => completed.includes(v.name)).length;
    });
    if (totalPossible === 0) return { score: 0, level: 'Bronze', treeCount: 0 };
    const score = Math.round((totalCompleted / totalPossible) * 100);
    let level = 'Bronze';
    if (score >= 90) level = 'Gold';
    else if (score >= 70) level = 'Silver';
    const treeCount = Math.floor(totalCompleted / 5);
    return { score, level, treeCount };
}

// GET /api/impact — get impact for logged-in parent
exports.getImpact = async (req, res, next) => {
    try {
        const children = await ChildProfile.find({ parentId: req.user._id });
        const { score, level, treeCount } = computeImpact(children);

        // Upsert impact record
        let impact = await GreenCohortImpact.findOneAndUpdate(
            { parentId: req.user._id },
            { impactScore: score, sustainabilityLevel: level, treeCount },
            { new: true, upsert: true }
        );

        return res.status(200).json({ impact });
    } catch (error) {
        next(error);
    }
};
