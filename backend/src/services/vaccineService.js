//align with the Govt.
const indianVaccineSchedule = [
    { name: 'BCG', dueAgeWeeks: 0, description: 'At birth' },
    { name: 'OPV-0', dueAgeWeeks: 0, description: 'At birth (Zero dose)' },
    { name: 'Hepatitis B – Birth Dose', dueAgeWeeks: 0, description: 'At birth (within 24 hrs)' },
    { name: 'DTwP/DTaP-1', dueAgeWeeks: 6, description: '6 weeks' },
    { name: 'IPV-1', dueAgeWeeks: 6, description: '6 weeks' },
    { name: 'Hepatitis B-2', dueAgeWeeks: 6, description: '6 weeks' },
    { name: 'Hib-1', dueAgeWeeks: 6, description: '6 weeks' },
    { name: 'Rotavirus-1', dueAgeWeeks: 6, description: '6 weeks' },
    { name: 'PCV-1', dueAgeWeeks: 6, description: '6 weeks' },
    { name: 'DTwP/DTaP-2', dueAgeWeeks: 10, description: '10 weeks' },
    { name: 'IPV-2', dueAgeWeeks: 10, description: '10 weeks' },
    { name: 'Hib-2', dueAgeWeeks: 10, description: '10 weeks' },
    { name: 'Rotavirus-2', dueAgeWeeks: 10, description: '10 weeks' },
    { name: 'PCV-2', dueAgeWeeks: 10, description: '10 weeks' },
    { name: 'DTwP/DTaP-3', dueAgeWeeks: 14, description: '14 weeks' },
    { name: 'IPV-3', dueAgeWeeks: 14, description: '14 weeks' },
    { name: 'Hepatitis B-3', dueAgeWeeks: 14, description: '14 weeks' },
    { name: 'Hib-3', dueAgeWeeks: 14, description: '14 weeks' },
    { name: 'Rotavirus-3', dueAgeWeeks: 14, description: '14 weeks' },
    { name: 'PCV-3', dueAgeWeeks: 14, description: '14 weeks' },
    { name: 'OPV-1', dueAgeWeeks: 26, description: '6 months' },
    { name: 'Influenza-1', dueAgeWeeks: 26, description: '6 months' },
    { name: 'Influenza-2', dueAgeWeeks: 30, description: '7 months' },
    { name: 'MMR-1', dueAgeWeeks: 36, description: '9 months' },
    { name: 'OPV-2', dueAgeWeeks: 36, description: '9 months (NIS)' },
    { name: 'Japanese Encephalitis-1', dueAgeWeeks: 36, description: '9 months (endemic areas – NIS)' },
    { name: 'Hepatitis A-1', dueAgeWeeks: 52, description: '12 months' },
    { name: 'Typhoid Conjugate Vaccine (TCV)', dueAgeWeeks: 52, description: '12 months' },
    { name: 'MMR-2', dueAgeWeeks: 65, description: '15 months' },
    { name: 'Varicella-1', dueAgeWeeks: 65, description: '15 months' },
    { name: 'PCV Booster', dueAgeWeeks: 65, description: '15 months' },
    { name: 'DTwP/DTaP Booster-1', dueAgeWeeks: 68, description: '16-18 months' },
    { name: 'Hib Booster', dueAgeWeeks: 68, description: '16-18 months' },
    { name: 'IPV Booster', dueAgeWeeks: 68, description: '16-18 months' },
    { name: 'Japanese Encephalitis-2', dueAgeWeeks: 68, description: '16-18 months (endemic areas – NIS)' },
    { name: 'Hepatitis A-2', dueAgeWeeks: 78, description: '18 months' },
    { name: 'OPV-3', dueAgeWeeks: 78, description: '18 months (NIS Booster)' },
    { name: 'DTwP/DTaP Booster-2', dueAgeWeeks: 208, description: '4-6 years' },
    { name: 'OPV-4', dueAgeWeeks: 260, description: '5 years (NIS Booster)' },
    { name: 'Varicella-2', dueAgeWeeks: 260, description: '5 years (2nd dose, minimum 3 months gap)' },
    { name: 'HPV-1 (Girls)', dueAgeWeeks: 468, description: '9 years (IAP recommended for girls)' },
    { name: 'HPV-2 (Girls)', dueAgeWeeks: 494, description: '9.5 years (6 months after HPV-1)' },
    { name: 'Tdap/Td', dueAgeWeeks: 520, description: '10-12 years' },
    { name: 'Typhoid Booster', dueAgeWeeks: 520, description: '10-12 years (every 3 years)' },
];

function getWeeksBetweenDates(startDate, endDate) {
    const msPerWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.floor((endDate - startDate) / msPerWeek);
}

/**
 * Returns upcoming vaccines for a child based on DOB
 */
function getUpcomingVaccines(dob) {
    const now = new Date();
    const ageWeeks = getWeeksBetweenDates(new Date(dob), now);
    return indianVaccineSchedule.filter(vac => vac.dueAgeWeeks > ageWeeks);
}

function getFullSchedule(dob, completedVaccineNames) {
    const dobDate = new Date(dob);
    const now = new Date();
    const msPerWeek = 1000 * 60 * 60 * 24 * 7;
    const ageWeeks = getWeeksBetweenDates(dobDate, now);

    const schedule = indianVaccineSchedule.map(vac => {
        const dueDate = new Date(dobDate.getTime() + vac.dueAgeWeeks * msPerWeek);
        let status = 'upcoming';
        if (completedVaccineNames.includes(vac.name)) {
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

    return { schedule, ageWeeks };
}

module.exports = {
    indianVaccineSchedule,
    getUpcomingVaccines,
    getFullSchedule,
};
