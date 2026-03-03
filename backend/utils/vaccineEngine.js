// vaccineEngine.js
// Utility to get upcoming vaccines for a child based on Indian schedule

const schedule = [
    { name: 'BCG', week: 0 },
    { name: 'Hepatitis B', week: 6 },
    { name: 'DPT', week: 10 },
    { name: 'MMR', week: 36 },
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
    return schedule.filter(vac => vac.week > ageWeeks);
}

module.exports = {
    getUpcomingVaccines,
    schedule,
};