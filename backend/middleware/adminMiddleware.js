// Basic admin role check middleware
const User = require('../models/User');

async function adminCheck(req, res, next) {
    // In production, use authentication and check req.user.role
    // Here, check ?admin=true or header for demo
    const isAdmin = req.query.admin === 'true' || req.headers['x-admin'] === 'true';
    if (!isAdmin) {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
}

module.exports = adminCheck;