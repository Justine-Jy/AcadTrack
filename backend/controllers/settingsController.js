const connectDB = require('../config/database');
const bcryptjs = require('bcryptjs');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

// @route  GET /api/settings/profile
const getProfile = asyncHandler(async (req, res) => {
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

// @route  PUT /api/settings/profile
const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = ['firstName', 'lastName', 'email', 'program', 'yearLevel'];
  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  if (Object.keys(updates).length === 0) {
    throw new AppError('No fields to update', 400);
  }

  const connection = await connectDB();

  const updateFields = Object.keys(updates)
    .map((key) => `${key} = ?`)
    .join(', ');
  const updateValues = Object.values(updates);
  updateValues.push(req.user.id);

  await connection.query(`UPDATE users SET ${updateFields} WHERE id = ?`, updateValues);

  const [rows] = await connection.query(
    'SELECT id, studentId, firstName, lastName, email, role, program, yearLevel, isActive FROM users WHERE id = ?',
    [req.user.id]
  );

  if (rows.length === 0) {
    throw new AppError('User not found', 404);
  }

  res.json({
    success: true,
    data: rows[0],
    message: 'Profile updated successfully',
  });
});

// @route  PUT /api/settings/password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new AppError(
      'Please provide current password, new password, and confirmation',
      400
    );
  }

  if (newPassword !== confirmPassword) {
    throw new AppError('New password and confirmation do not match', 400);
  }

  if (newPassword.length < 6) {
    throw new AppError('New password must be at least 6 characters', 400);
  }

  const connection = await connectDB();

  const [rows] = await connection.query('SELECT password FROM users WHERE id = ?', [
    req.user.id,
  ]);

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

  res.json({ success: true, message: 'Password changed successfully' });
});

// @route  GET /api/settings/notifications
const getNotificationPrefs = asyncHandler(async (req, res) => {
  const connection = await connectDB();

  const [rows] = await connection.query(
    'SELECT notificationPrefs FROM users WHERE id = ?',
    [req.user.id]
  );

  if (rows.length === 0) {
    throw new AppError('User not found', 404);
  }

  const prefs = rows[0].notificationPrefs
    ? JSON.parse(rows[0].notificationPrefs)
    : {
        emailAnnouncements: true,
        emailGrades: true,
        emailSchedule: false,
        pushAnnouncements: true,
        pushGrades: true,
        pushDeadlines: true,
      };

  res.json({ success: true, data: prefs });
});

// @route  PUT /api/settings/notifications
const updateNotificationPrefs = asyncHandler(async (req, res) => {
  const connection = await connectDB();

  await connection.query('UPDATE users SET notificationPrefs = ? WHERE id = ?', [
    JSON.stringify(req.body),
    req.user.id,
  ]);

  res.json({
    success: true,
    data: req.body,
    message: 'Notification preferences updated',
  });
});

// @route  GET /api/settings/theme
const getThemePrefs = asyncHandler(async (req, res) => {
  const connection = await connectDB();

  const [rows] = await connection.query('SELECT themePrefs FROM users WHERE id = ?', [
    req.user.id,
  ]);

  if (rows.length === 0) {
    throw new AppError('User not found', 404);
  }

  const prefs = rows[0].themePrefs
    ? JSON.parse(rows[0].themePrefs)
    : {
        colorScheme: 'light',
        accentColor: 'sage',
        fontSize: 'medium',
        compactMode: false,
      };

  res.json({ success: true, data: prefs });
});

// @route  PUT /api/settings/theme
const updateThemePrefs = asyncHandler(async (req, res) => {
  const connection = await connectDB();

  await connection.query('UPDATE users SET themePrefs = ? WHERE id = ?', [
    JSON.stringify(req.body),
    req.user.id,
  ]);

  res.json({
    success: true,
    data: req.body,
    message: 'Theme preferences updated',
  });
});

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getNotificationPrefs,
  updateNotificationPrefs,
  getThemePrefs,
  updateThemePrefs,
};