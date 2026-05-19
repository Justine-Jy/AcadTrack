const connectDB = require('../config/database');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

const getAllStudents = asyncHandler(async (req, res) => {
  const { search, yearLevel, program, page = 1, limit = 20 } = req.query;

  const connection = await connectDB();

  let query = 'SELECT id, studentId, firstName, lastName, email, program, yearLevel, isActive, createdAt FROM users WHERE role = "student"';
  const params = [];

  if (yearLevel) {
    query += ' AND yearLevel = ?';
    params.push(parseInt(yearLevel));
  }

  if (program) {
    query += ' AND program = ?';
    params.push(program);
  }

  if (search) {
    query += ' AND (studentId LIKE ? OR firstName LIKE ? OR lastName LIKE ? OR email LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }

  // Get total count
  const countQuery = query.replace(/SELECT .+ FROM/, 'SELECT COUNT(*) as total FROM');
  const [countResult] = await connection.query(countQuery, params);
  const total = countResult[0].total;

  // Add pagination
  const skip = (page - 1) * limit;
  query += ' ORDER BY studentId LIMIT ? OFFSET ?';
  params.push(parseInt(limit), skip);

  const [students] = await connection.query(query, params);

  res.json({
    success: true,
    count: students.length,
    total,
    data: students,
  });
});

const getStudent = asyncHandler(async (req, res) => {
  const connection = await connectDB();

  const [rows] = await connection.query(
    'SELECT id, studentId, firstName, lastName, email, program, yearLevel, isActive, createdAt FROM users WHERE id = ? AND role = "student"',
    [req.params.id]
  );

  if (rows.length === 0) {
    throw new AppError('Student not found', 404);
  }

  res.json({ success: true, data: rows[0] });
});

const updateStudent = asyncHandler(async (req, res) => {
  const { password, ...updates } = req.body; // Never update password here

  const connection = await connectDB();

  // Build dynamic update query
  const updateFields = Object.keys(updates)
    .map((key) => `${key} = ?`)
    .join(', ');
  const updateValues = Object.values(updates);

  if (!updateFields) {
    throw new AppError('No fields to update', 400);
  }

  updateValues.push(req.params.id);

  await connection.query(
    `UPDATE users SET ${updateFields} WHERE id = ? AND role = "student"`,
    updateValues
  );

  const [rows] = await connection.query(
    'SELECT id, studentId, firstName, lastName, email, program, yearLevel, isActive FROM users WHERE id = ?',
    [req.params.id]
  );

  if (rows.length === 0) {
    throw new AppError('Student not found', 404);
  }

  res.json({
    success: true,
    data: rows[0],
    message: 'Student updated successfully!',
  });
});

const deactivateStudent = asyncHandler(async (req, res) => {
  const connection = await connectDB();

  await connection.query('UPDATE users SET isActive = false WHERE id = ? AND role = "student"', [
    req.params.id,
  ]);

  const [rows] = await connection.query(
    'SELECT id, studentId, firstName, lastName, email, isActive FROM users WHERE id = ?',
    [req.params.id]
  );

  if (rows.length === 0) {
    throw new AppError('Student not found', 404);
  }

  res.json({
    success: true,
    message: 'Student deactivated',
    data: rows[0],
  });
});

module.exports = { getAllStudents, getStudent, updateStudent, deactivateStudent };