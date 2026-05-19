const connectDB = require('../config/database');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

const getMyEnrollments = asyncHandler(async (req, res) => {
  const { semester, academicYear, status } = req.query;
  const connection = await connectDB();

  let query =
    'SELECT e.id, e.student, e.subject, e.semester, e.academicYear, e.status, e.enrolledAt, s.code, s.name, s.units, s.type, s.schedule, s.instructorName FROM enrollments e JOIN subjects s ON e.subject = s.id WHERE e.student = ?';
  const params = [req.user.id];

  if (semester) {
    query += ' AND e.semester = ?';
    params.push(semester);
  }
  if (academicYear) {
    query += ' AND e.academicYear = ?';
    params.push(academicYear);
  }
  if (status) {
    query += ' AND e.status = ?';
    params.push(status);
  }

  query += ' ORDER BY e.enrolledAt DESC';

  const [enrollments] = await connection.query(query, params);

  res.json({ success: true, count: enrollments.length, data: enrollments });
});

const enrollSubject = asyncHandler(async (req, res) => {
  const { subjectId, semester, academicYear } = req.body;

  if (!subjectId || !semester || !academicYear) {
    throw new AppError('Subject ID, semester, and academic year are required', 400);
  }

  const connection = await connectDB();

  // Check if subject exists and is open
  const [subjects] = await connection.query(
    'SELECT id, code, name, units, instructorName, currentSlots, maxSlots, isOpen FROM subjects WHERE id = ?',
    [subjectId]
  );

  if (subjects.length === 0) {
    throw new AppError('Subject not found', 404);
  }

  const subject = subjects[0];

  if (!subject.isOpen) {
    throw new AppError('This subject is closed for enrollment', 400);
  }

  if (subject.currentSlots >= subject.maxSlots) {
    throw new AppError('No available slots', 400);
  }

  // Check if already enrolled
  const [existing] = await connection.query(
    'SELECT id FROM enrollments WHERE student = ? AND subject = ? AND semester = ? AND academicYear = ? AND status = "enrolled"',
    [req.user.id, subjectId, semester, academicYear]
  );

  if (existing.length > 0) {
    throw new AppError('Already enrolled in this subject', 400);
  }

  // Create enrollment
  const [enrollResult] = await connection.query(
    'INSERT INTO enrollments (student, subject, semester, academicYear, status) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, subjectId, semester, academicYear, 'enrolled']
  );

  // Update subject slots
  await connection.query('UPDATE subjects SET currentSlots = currentSlots + 1 WHERE id = ?', [
    subjectId,
  ]);

  // Create grade record
  await connection.query(
    'INSERT INTO grades (student, subject, enrollment, semester, academicYear, remarks) VALUES (?, ?, ?, ?, ?, ?)',
    [req.user.id, subjectId, enrollResult.insertId, semester, academicYear, 'In Progress']
  );

  // Return enrollment
  const [newEnrollment] = await connection.query(
    'SELECT e.id, e.student, e.subject, e.semester, e.academicYear, e.status, s.code, s.name, s.units, s.instructorName FROM enrollments e JOIN subjects s ON e.subject = s.id WHERE e.id = ?',
    [enrollResult.insertId]
  );

  res.status(201).json({ success: true, data: newEnrollment[0] });
});

const dropSubject = asyncHandler(async (req, res) => {
  const connection = await connectDB();

  // Check enrollment exists
  const [enrollments] = await connection.query(
    'SELECT id, status, subject, semester FROM enrollments WHERE id = ? AND student = ?',
    [req.params.id, req.user.id]
  );

  if (enrollments.length === 0) {
    throw new AppError('Enrollment record not found', 404);
  }

  const enrollment = enrollments[0];

  if (enrollment.status !== 'enrolled') {
    throw new AppError(`Cannot drop: status is ${enrollment.status}`, 400);
  }

  // Update enrollment status
  await connection.query('UPDATE enrollments SET status = ?, droppedAt = NOW() WHERE id = ?', [
    'dropped',
    req.params.id,
  ]);

  // Update subject slots
  await connection.query('UPDATE subjects SET currentSlots = currentSlots - 1 WHERE id = ?', [
    enrollment.subject,
  ]);

  // Update grade status
  await connection.query(
    'UPDATE grades SET remarks = ? WHERE student = ? AND subject = ? AND semester = ?',
    ['Dropped', req.user.id, enrollment.subject, enrollment.semester]
  );

  const [updatedEnrollment] = await connection.query(
    'SELECT id, student, subject, semester, academicYear, status FROM enrollments WHERE id = ?',
    [req.params.id]
  );

  res.json({
    success: true,
    message: 'Subject dropped successfully',
    data: updatedEnrollment[0],
  });
});

const getAllEnrollments = asyncHandler(async (req, res) => {
  const { semester, academicYear, subjectId, studentId } = req.query;
  const connection = await connectDB();

  let query =
    'SELECT e.id, e.student, e.subject, e.semester, e.academicYear, e.status, u.studentId, u.firstName, u.lastName, u.email, s.code, s.name, s.units FROM enrollments e JOIN users u ON e.student = u.id JOIN subjects s ON e.subject = s.id WHERE 1=1';
  const params = [];

  if (semester) {
    query += ' AND e.semester = ?';
    params.push(semester);
  }
  if (academicYear) {
    query += ' AND e.academicYear = ?';
    params.push(academicYear);
  }
  if (subjectId) {
    query += ' AND e.subject = ?';
    params.push(subjectId);
  }
  if (studentId) {
    query += ' AND e.student = ?';
    params.push(studentId);
  }

  query += ' ORDER BY e.enrolledAt DESC';

  const [enrollments] = await connection.query(query, params);

  res.json({ success: true, count: enrollments.length, data: enrollments });
});

module.exports = { getMyEnrollments, enrollSubject, dropSubject, getAllEnrollments };