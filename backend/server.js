require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');
const env = require('./src/config/env');
const logger = require('./src/utils/logger');
const { startReminderScheduler } = require('./src/services/reminderScheduler');

// Connect to MongoDB, then start listening
const PORT = env.PORT;

(async () => {
    await connectDB();
    app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT} in ${env.NODE_ENV} mode`);
        // Start automatic reminder scheduler
        startReminderScheduler();
    });
})();
