const connectDB = require('../config/database');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

const sendToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });

  res.status(statusCode).json({
    success: true,
    token,
    data: {
      id: user.id,
      studentId: user.studentId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      program: user.program,
      yearLevel: user.yearLevel,
    },
  });
};

// @route  POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { studentId, firstName, lastName, email, password, program, yearLevel } = req.body;

  if (!studentId || !firstName || !lastName || !email || !password) {
    throw new AppError('All fields are required', 400);
  }

  const connection = await connectDB();

  // Check if student already exists
  const [existing] = await connection.query(
    'SELECT id FROM users WHERE studentId = ? OR email = ?',
    [studentId.toUpperCase(), email.toLowerCase()]
  );

  if (existing.length > 0) {
    throw new AppError('Student ID or email already exists', 400);
  }

  // Hash password
  const hashedPassword = await bcryptjs.hash(password, 12);

  // Create user
  const [result] = await connection.query(
    'INSERT INTO users (studentId, firstName, lastName, email, password, program, yearLevel, role, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      studentId.toUpperCase().trim(),
      firstName.trim(),
      lastName.trim(),
      email.toLowerCase().trim(),
      hashedPassword,
      program || 'High School',
      yearLevel ? parseInt(yearLevel) : 7,
      'student',
      true,
    ]
  );

  const user = {
    id: result.insertId,
    studentId: studentId.toUpperCase(),
    firstName,
    lastName,
    email: email.toLowerCase(),
    role: 'student',
    program: program || 'High School',
    yearLevel: yearLevel || 7,
  };

  sendToken(user, 201, res);
});

// @route  POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { studentId, password } = req.body;

  if (!studentId || !password) {
    throw new AppError('Please provide student ID and password', 400);
  }

  const connection = await connectDB();

  // Find user
  const [rows] = await connection.query(
    'SELECT id, studentId, firstName, lastName, email, password, role, program, yearLevel, isActive FROM users WHERE studentId = ?',
    [studentId.toUpperCase()]
  );

  if (rows.length === 0) {
    throw new AppError('Invalid credentials', 401);
  }

  const user = rows[0];

  // Check password
  const isPasswordMatch = await bcryptjs.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new AppError('Invalid credentials', 401);
  }

  if (!user.isActive) {
    throw new AppError('Account deactivated. Contact the registrar.', 403);
  }

  // Update last login
  await connection.query('UPDATE users SET lastLogin = NOW() WHERE id = ?', [user.id]);

  const safeUser = { ...user };
  delete safeUser.password;

  sendToken(safeUser, 200, res);
});

// @route  GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  const connection = await connectDB();

  const [rows] = await connection.query(
    'SELECT id, studentId, firstName, lastName, email, role, program, yearLevel, isActive, createdAt FROM users WHERE id = ?',
    [req.user.id]
  );

  if (rows.length === 0) {
    throw new AppError('User not found', 404);
  }

  res.json({ success: true, data: rows[0] });
});

// @route  PUT /api/auth/updatepassword
const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new AppError('Please provide current and new password', 400);
  }

  const connection = await connectDB();

  const [rows] = await connection.query(
    'SELECT password FROM users WHERE id = ?',
    [req.user.id]
  );

  if (rows.length === 0) {
    throw new AppError('User not found', 404);
  }

  // Check current password
  const isMatch = await bcryptjs.compare(currentPassword, rows[0].password);
  if (!isMatch) {
    throw new AppError('Current password is incorrect', 401);
  }

  // Hash new password
  const hashedPassword = await bcryptjs.hash(newPassword, 12);

  // Update password
  await connection.query('UPDATE users SET password = ? WHERE id = ?', [
    hashedPassword,
    req.user.id,
  ]);

  // Get updated user and send token
  const [updatedRows] = await connection.query(
    'SELECT id, studentId, firstName, lastName, email, role, program, yearLevel FROM users WHERE id = ?',
    [req.user.id]
  );

  sendToken(updatedRows[0], 200, res);
});

// @route  POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = { register, login, getMe, updatePassword, logout };