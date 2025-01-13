const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    const token = req.cookies.auth_token;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretKey');
            res.locals.user = { id: decoded.userId, role: decoded.role }; // Kirim data user ke view
        } catch (error) {
            console.error('Invalid token:', error);
            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }
    next();
};

module.exports = authenticateUser;
