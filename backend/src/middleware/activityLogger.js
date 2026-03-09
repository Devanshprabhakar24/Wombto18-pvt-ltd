const ActivityLog = require('../models/ActivityLog');


const activityLogger = (action, resource) => {
    return async (req, res, next) => {
        // Log after the response is sent
        const originalEnd = res.end;
        res.end = function (...args) {
            originalEnd.apply(res, args);
            // Only log successful operations (2xx status)
            if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
                ActivityLog.create({
                    userId: req.user._id,
                    action,
                    resource,
                    resourceId: req.params.id || req.params.childId || undefined,
                    details: `${req.method} ${req.originalUrl} — ${res.statusCode}`,
                    ipAddress: req.ip || req.connection?.remoteAddress || '',
                }).catch(() => { }); // fire-and-forget
            }
        };
        next();
    };
};

module.exports = { activityLogger };
