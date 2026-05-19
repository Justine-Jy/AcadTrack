const jwt = require('jsonwebtoken');
const connectDB = require('../config/database');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized. No token provided.' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decoded:', decoded);
  } catch (err) {
    console.log('❌ Token verify failed:', err.message);
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }

  try {
    const connection = await connectDB();
    console.log('✅ DB connected, looking up user id:', decoded.id);

    const [rows] = await connection.query(
      'SELECT id, studentId, firstName, lastName, email, role, program, yearLevel, isActive FROM users WHERE id = ?',
      [decoded.id]
    );

    console.log('✅ DB rows found:', rows.length);

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'User not found.' });
    }

    if (!rows[0].isActive) {
      return res.status(401).json({ success: false, message: 'User account is inactive.' });
    }

    req.user = rows[0];
    next();
  } catch (err) {
    console.log('❌ DB error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error during authentication.' });
  }
};

exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: `Role '${req.user.role}' is not authorized for this action.`,
    });
  }
  next();
};