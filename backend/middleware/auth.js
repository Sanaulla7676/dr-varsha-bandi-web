const jwt = require('jsonwebtoken');
const Doctor = require('../models/Doctor');
const AuditLog = require('../models/AuditLog');

const SECRET = process.env.JWT_SECRET || 'homeopathway-super-secret-jwt-key-2024';

// Middleware: Authenticate JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, SECRET);
    if (decoded.id === 'mock-id') {
      decoded.id = '000000000000000000000000'; // Valid 24-char hex string for MongoDB
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Middleware: Log audit trail (non-blocking)
const auditLog = (action, entity) => async (req, res, next) => {
  res.on('finish', async () => {
    if (res.statusCode < 400) {
      try {
        await AuditLog.create({
          doctorId: req.user?.id,
          action,
          entity,
          entityId: req.params?.id,
          details: `${req.method} ${req.originalUrl}`,
          ip: req.ip,
        });
      } catch (e) { /* silent */ }
    }
  });
  next();
};

module.exports = { authenticateToken, auditLog };
