const rateLimit = {};

/**
 * Simple in-memory rate limiter middleware.
 * @param {number} windowMs - Time window in milliseconds
 * @param {number} max - Max requests per window
 */
const rateLimiter = (windowMs = 15 * 60 * 1000, max = 1000) => {
    return (req, res, next) => {
        const key = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip;
        const now = Date.now();

        if (!rateLimit[key]) {
            rateLimit[key] = { count: 1, startTime: now };
            return next();
        }

        const elapsed = now - rateLimit[key].startTime;
        if (elapsed > windowMs) {
            rateLimit[key] = { count: 1, startTime: now };
            return next();
        }

        rateLimit[key].count++;
        if (rateLimit[key].count > max) {
            return res.status(429).json({ message: 'Too many requests. Please try again later.' });
        }

        next();
    };
};

module.exports = { rateLimiter };
