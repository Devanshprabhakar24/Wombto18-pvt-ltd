// vaccineUtils.js
// Utility to get upcoming vaccines for a child based on Indian schedule

const indianVaccineSchedule = [
    { name: 'BCG', dueAgeWeeks: 0, description: 'At birth' },
    { name: 'OPV-0', dueAgeWeeks: 0, description: 'At birth' },
    { name: 'Hepatitis B-1', dueAgeWeeks: 0, description: 'At birth' },
    { name: 'DTP-1', dueAgeWeeks: 6, description: '6 weeks' },
    { name: 'IPV-1', dueAgeWeeks: 6, description: '6 weeks' },
    { name: 'Hepatitis B-2', dueAgeWeeks: 6, description: '6 weeks' },
    { name: 'Hib-1', dueAgeWeeks: 6, description: '6 weeks' },
    { name: 'Rotavirus-1', dueAgeWeeks: 6, description: '6 weeks' },
    { name: 'PCV-1', dueAgeWeeks: 6, description: '6 weeks' },
    { name: 'DTP-2', dueAgeWeeks: 10, description: '10 weeks' },
    { name: 'IPV-2', dueAgeWeeks: 10, description: '10 weeks' },
    { name: 'Hib-2', dueAgeWeeks: 10, description: '10 weeks' },
    { name: 'Rotavirus-2', dueAgeWeeks: 10, description: '10 weeks' },
    { name: 'PCV-2', dueAgeWeeks: 10, description: '10 weeks' },
    { name: 'DTP-3', dueAgeWeeks: 14, description: '14 weeks' },
    { name: 'IPV-3', dueAgeWeeks: 14, description: '14 weeks' },
    { name: 'Hib-3', dueAgeWeeks: 14, description: '14 weeks' },
    { name: 'Rotavirus-3', dueAgeWeeks: 14, description: '14 weeks' },
    { name: 'PCV-3', dueAgeWeeks: 14, description: '14 weeks' },
    { name: 'MMR-1', dueAgeWeeks: 36, description: '9 months' },
    { name: 'Typhoid', dueAgeWeeks: 52, description: '12 months' },
    { name: 'Hepatitis A', dueAgeWeeks: 52, description: '12 months' },
    { name: 'MMR-2', dueAgeWeeks: 68, description: '15-18 months' },
    { name: 'DTP Booster-1', dueAgeWeeks: 68, description: '15-18 months' },
    { name: 'Hib Booster', dueAgeWeeks: 68, description: '15-18 months' },
    { name: 'Varicella', dueAgeWeeks: 68, description: '15-18 months' },
    { name: 'Hepatitis A-2', dueAgeWeeks: 78, description: '18 months' },
    { name: 'DTP Booster-2', dueAgeWeeks: 208, description: '5 years' },
    { name: 'Typhoid Booster', dueAgeWeeks: 260, description: '7 years' },
    { name: 'Tdap/Td', dueAgeWeeks: 624, description: '12 years' }
];

function getWeeksBetweenDates(startDate, endDate) {
    const msPerWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.floor((endDate - startDate) / msPerWeek);
}

/**
 * Returns upcoming vaccines for a child based on DOB
 * @param {Date} dob - Date of birth
 * @returns {Array} - List of upcoming vaccines
 */
function getUpcomingVaccines(dob) {
    const now = new Date();
    const ageWeeks = getWeeksBetweenDates(new Date(dob), now);
    return indianVaccineSchedule.filter(vac => vac.dueAgeWeeks > ageWeeks);
}

module.exports = {
    getUpcomingVaccines,
    indianVaccineSchedule,
};
