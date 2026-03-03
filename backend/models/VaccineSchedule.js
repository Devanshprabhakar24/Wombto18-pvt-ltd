const mongoose = require('mongoose');

const vaccineScheduleSchema = new mongoose.Schema({
    name: { type: String, required: true, index: true },
    recommendedAgeInWeeks: { type: Number, required: true },
});

module.exports = mongoose.model('VaccineSchedule', vaccineScheduleSchema);
