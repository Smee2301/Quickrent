const jwt = require('jsonwebtoken');

function authRequired(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [, token] = header.split(' ');
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    req.userId = payload.sub;
    req.userRole = payload.role;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

module.exports = { authRequired };


