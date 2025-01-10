const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

exports.authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token missing.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token.' });
    req.user = user;
    next();
  });
};

exports.authorizeRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Access denied.' });
  }
  next();
};
