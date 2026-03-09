const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '../../logs');

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

const logLevels = ['info', 'warn', 'error', 'debug'];

function formatMessage(level, message) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
}

function writeToFile(formatted) {
    const logFile = path.join(LOG_DIR, `app-${new Date().toISOString().slice(0, 10)}.log`);
    fs.appendFileSync(logFile, formatted + '\n', 'utf8');
}

const logger = {
    info: (msg) => {
        const formatted = formatMessage('info', msg);
        console.log(formatted);
        writeToFile(formatted);
    },
    warn: (msg) => {
        const formatted = formatMessage('warn', msg);
        console.warn(formatted);
        writeToFile(formatted);
    },
    error: (msg) => {
        const formatted = formatMessage('error', msg);
        console.error(formatted);
        writeToFile(formatted);
    },
    debug: (msg) => {
        if (process.env.NODE_ENV !== 'production') {
            const formatted = formatMessage('debug', msg);
            console.debug(formatted);
            writeToFile(formatted);
        }
    },
};

module.exports = logger;
