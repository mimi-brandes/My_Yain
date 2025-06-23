import jwt from 'jsonwebtoken';

export const authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.status(403).json({ message: 'Invalid token.' });

            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({ message: 'Access forbidden: insufficient permissions.' });
            }

            req.user = user;
            next();
        });
    };
};