const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.SECRET_KEY || "magiya_highly_secure_secret_key_999";

// Admin Authentication Middleware
const adminAuth = (req, res, next) => {
    try {
        // 1. Get admin token from cookies
        const token = req.cookies.admin_token;

        // 2. Check if token exists
        if (!token) {
            return res.status(401).json({
                authenticated: false,
                message: 'Access denied. Admin authentication required.'
            });
        }

        // 3. Verify token
        const decoded = jwt.verify(token, SECRET_KEY);

        // 4. Check if user is admin
        if (decoded.role !== 'admin') {
            return res.status(403).json({
                authenticated: false,
                message: 'Access denied. Admin privileges required.'
            });
        }

        // 5. Attach user info to request
        req.user = decoded;

        // 6. Proceed to next middleware/route
        next();

    } catch (err) {
        console.error('Admin auth error:', err.message);
        return res.status(401).json({
            authenticated: false,
            message: 'Invalid or expired admin session.'
        });
    }
};

module.exports = adminAuth;
