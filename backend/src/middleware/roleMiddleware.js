
// WombTo18 project code
const roleCheck = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: 'Access denied. No role assigned.' });
        }
        const userRoleName = req.user.role.name || req.user.role;
        if (!roles.includes(userRoleName)) {
            return res.status(403).json({ message: `Access denied. Required role(s): ${roles.join(', ')}` });
        }
        next();
    };
};

module.exports = { roleCheck };
