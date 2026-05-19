const connectDB = require('../config/database');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

const getSubjects = asyncHandler(async (req, res) => {
  const connection = await connectDB();

  const [subjects] = await connection.query(
    'SELECT id, code, name, description, units, type, instructorName, maxSlots, currentSlots, isOpen FROM subjects'
  );

  res.json({ success: true, count: subjects.length, data: subjects });
});

const getSubject = asyncHandler(async (req, res) => {
  const connection = await connectDB();

  const [subjects] = await connection.query(
    'SELECT id, code, name, description, units, type, instructorName, maxSlots, currentSlots, isOpen FROM subjects WHERE id = ?',
    [req.params.id]
  );

  if (subjects.length === 0) {
    throw new AppError('Subject not found', 404);
  }

  // Get schedule
  const [schedule] = await connection.query(
    'SELECT id, day, startTime, endTime, room FROM schedules WHERE subjectId = ?',
    [req.params.id]
  );

  const subject = {
    ...subjects[0],
    schedule,
  };

  res.json({ success: true, data: subject });
});

const createSubject = asyncHandler(async (req, res) => {
  const { code, name, description, units, type, instructorName, maxSlots, isOpen, schedule } =
    req.body;

  if (!code || !name) {
    throw new AppError('Code and name are required', 400);
  }

  const connection = await connectDB();

  // Check if subject code already exists
  const [existing] = await connection.query('SELECT id FROM subjects WHERE code = ?', [code]);

  if (existing.length > 0) {
    throw new AppError('Subject code already exists', 400);
  }

  // Create subject
  const [result] = await connection.query(
    'INSERT INTO subjects (code, name, description, units, type, instructorName, maxSlots, isOpen) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [code, name, description || null, units || 3, type || 'lecture', instructorName || null, maxSlots || 50, isOpen !== false]
  );

  // Add schedule if provided
  if (schedule && Array.isArray(schedule)) {
    for (const slot of schedule) {
      await connection.query(
        'INSERT INTO schedules (subjectId, day, startTime, endTime, room) VALUES (?, ?, ?, ?, ?)',
        [result.insertId, slot.day, slot.startTime, slot.endTime, slot.room]
      );
    }
  }

  const [newSubject] = await connection.query(
    'SELECT id, code, name, description, units, type, instructorName, maxSlots, currentSlots, isOpen FROM subjects WHERE id = ?',
    [result.insertId]
  );

  res.status(201).json({ success: true, data: newSubject[0] });
});

const updateSubject = asyncHandler(async (req, res) => {
  const { code, schedule, ...updates } = req.body;

  const connection = await connectDB();

  // Check if subject exists
  const [existing] = await connection.query('SELECT id FROM subjects WHERE id = ?', [
    req.params.id,
  ]);

  if (existing.length === 0) {
    throw new AppError('Subject not found', 404);
  }

  // Check if new code already exists
  if (code) {
    const [codeExists] = await connection.query(
      'SELECT id FROM subjects WHERE code = ? AND id != ?',
      [code, req.params.id]
    );
    if (codeExists.length > 0) {
      throw new AppError('Subject code already exists', 400);
    }
    updates.code = code;
  }

  // Update subject
  const updateFields = Object.keys(updates)
    .map((key) => `${key} = ?`)
    .join(', ');
  const updateValues = Object.values(updates);

  if (updateFields) {
    updateValues.push(req.params.id);
    await connection.query(`UPDATE subjects SET ${updateFields} WHERE id = ?`, updateValues);
  }

  // Update schedule if provided
  if (schedule && Array.isArray(schedule)) {
    await connection.query('DELETE FROM schedules WHERE subjectId = ?', [req.params.id]);
    for (const slot of schedule) {
      await connection.query(
        'INSERT INTO schedules (subjectId, day, startTime, endTime, room) VALUES (?, ?, ?, ?, ?)',
        [req.params.id, slot.day, slot.startTime, slot.endTime, slot.room]
      );
    }
  }

  const [updatedSubject] = await connection.query(
    'SELECT id, code, name, description, units, type, instructorName, maxSlots, currentSlots, isOpen FROM subjects WHERE id = ?',
    [req.params.id]
  );

  res.json({ success: true, data: updatedSubject[0] });
});

const deleteSubject = asyncHandler(async (req, res) => {
  const connection = await connectDB();

  const [existing] = await connection.query('SELECT id FROM subjects WHERE id = ?', [
    req.params.id,
  ]);

  if (existing.length === 0) {
    throw new AppError('Subject not found', 404);
  }

  // Delete schedules first
  await connection.query('DELETE FROM schedules WHERE subjectId = ?', [req.params.id]);

  // Delete subject
  await connection.query('DELETE FROM subjects WHERE id = ?', [req.params.id]);

  res.json({ success: true, message: 'Subject deleted successfully' });
});

module.exports = {
  getSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject,
};