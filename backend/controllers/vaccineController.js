const ChildProfile = require('../models/ChildProfile');
const { getUpcomingVaccines, indianVaccineSchedule } = require('../utils/vaccineUtils');

// GET /api/vaccines/:childId — upcoming vaccines for a child
exports.getUpcomingVaccinesForChild = async (req, res, next) => {
    try {
        const { childId } = req.params;
        const child = await ChildProfile.findById(childId);
        if (!child) {
            return res.status(404).json({ message: 'Child not found' });
        }
        if (!child.dob) {
            return res.status(400).json({ message: 'Child DOB not found' });
        }
        const upcoming = getUpcomingVaccines(child.dob);
        return res.status(200).json({ upcomingVaccines: upcoming });
    } catch (error) {
        next(error);
    }
};

// GET /api/vaccines/:childId/all — full schedule with status for a child
exports.getFullScheduleForChild = async (req, res, next) => {
    try {
        const { childId } = req.params;
        const child = await ChildProfile.findById(childId);
        if (!child) {
            return res.status(404).json({ message: 'Child not found' });
        }
        if (!child.dob) {
            return res.status(400).json({ message: 'Child DOB not found' });
        }
        const dob = new Date(child.dob);
        const now = new Date();
        const msPerWeek = 1000 * 60 * 60 * 24 * 7;
        const ageWeeks = Math.floor((now - dob) / msPerWeek);

        const completedNames = child.completedVaccines || [];

        const schedule = indianVaccineSchedule.map(vac => {
            const dueDate = new Date(dob.getTime() + vac.dueAgeWeeks * msPerWeek);
            let status = 'upcoming';
            if (completedNames.includes(vac.name)) {
                status = 'completed';
            } else if (vac.dueAgeWeeks < ageWeeks) {
                status = 'overdue';
            }
            return {
                ...vac,
                dueDate: dueDate.toISOString(),
                status,
            };
        });

        return res.status(200).json({ schedule, ageWeeks });
    } catch (error) {
        next(error);
    }
};

// PATCH /api/vaccines/:childId/mark — mark a vaccine as completed
exports.markVaccineComplete = async (req, res, next) => {
    try {
        const { childId } = req.params;
        const { vaccineName } = req.body;
        if (!vaccineName) {
            return res.status(400).json({ message: 'vaccineName is required' });
        }
        const child = await ChildProfile.findById(childId);
        if (!child) {
            return res.status(404).json({ message: 'Child not found' });
        }
        if (!child.completedVaccines) child.completedVaccines = [];
        if (!child.completedVaccines.includes(vaccineName)) {
            child.completedVaccines.push(vaccineName);
            await child.save();
        }
        return res.status(200).json({ message: 'Vaccine marked as completed', completedVaccines: child.completedVaccines });
    } catch (error) {
        next(error);
    }
};