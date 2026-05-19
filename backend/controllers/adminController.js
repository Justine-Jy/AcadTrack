const connectDB = require('../config/database');
const bcryptjs = require('bcryptjs');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

// GET /api/admin/dashboard
const getAdminDashboard = asyncHandler(async (req, res) => {
  const connection = await connectDB();

  const [totalStudents] = await connection.query(
    'SELECT COUNT(*) as count FROM users WHERE role = "student" AND isActive = true'
  );
  const [totalFaculty] = await connection.query(
    'SELECT COUNT(*) as count FROM users WHERE role = "faculty" AND isActive = true'
  );
  const [totalSubjects] = await connection.query(
    'SELECT COUNT(*) as count FROM subjects WHERE isOpen = true'
  );
  const [totalEnrollments] = await connection.query(
    'SELECT COUNT(*) as count FROM enrollments WHERE status = "enrolled"'
  );

  const [recentStudents] = await connection.query(
    'SELECT id, studentId, firstName, lastName, program, yearLevel, isActive, createdAt FROM users WHERE role = "student" ORDER BY createdAt DESC LIMIT 5'
  );

  const [subjectEnrollmentCounts] = await connection.query(
  `SELECT s.id, s.name, s.code, COUNT(e.id) as count
   FROM subjects s
   LEFT JOIN enrollments e ON s.id = e.subject AND e.status = "enrolled"
   GROUP BY s.id, s.name, s.code
   ORDER BY count DESC
   LIMIT 5`
);

  res.json({
    success: true,
    data: {
      stats: {
        totalStudents: totalStudents[0].count,
        totalFaculty: totalFaculty[0].count,
        totalSubjects: totalSubjects[0].count,
        totalEnrollments: totalEnrollments[0].count,
      },
      recentStudents,
      topEnrolledSubjects: subjectEnrollmentCounts,
      recentAnnouncements: [],
    },
  });
});

// GET /api/admin/reports/enrollment
const getEnrollmentReport = asyncHandler(async (req, res) => {
  const { semester, academicYear } = req.query;
  const connection = await connectDB();

  let query = `
    SELECT s.id, s.name, s.code, s.maxSlots,
           SUM(CASE WHEN e.status = 'enrolled' THEN 1 ELSE 0 END) as enrolledCount,
           SUM(CASE WHEN e.status = 'dropped' THEN 1 ELSE 0 END) as droppedCount,
           SUM(CASE WHEN e.status = 'completed' THEN 1 ELSE 0 END) as completedCount
    FROM subjects s
    LEFT JOIN enrollments e ON s.id = e.subject
  `;
  const params = [];

  if (semester) {
    query += ` WHERE e.semester = ?`;
    params.push(semester);
  }
  if (academicYear) {
    if (params.length > 0) query += ` AND e.academicYear = ?`;
    else query += ` WHERE e.academicYear = ?`;
    params.push(academicYear);
  }

  query += ` GROUP BY s.id, s.name, s.code, s.maxSlots ORDER BY s.name`;

  const [report] = await connection.query(query, params);
  res.json({ success: true, data: report });
});

// GET /api/admin/reports/grades
const getGradesReport = asyncHandler(async (req, res) => {
  const { semester, academicYear } = req.query;
  const connection = await connectDB();

  let query = `
    SELECT s.id, s.name, s.code,
           ROUND(AVG(g.grade), 2) as avgGrade,
           COUNT(g.id) as count,
           SUM(CASE WHEN g.grade <= 3.0 THEN 1 ELSE 0 END) as passCount,
           SUM(CASE WHEN g.grade > 3.0 THEN 1 ELSE 0 END) as failCount
    FROM subjects s
    LEFT JOIN grades g ON s.id = g.subject AND g.grade IS NOT NULL
  `;
  const params = [];

  if (semester) {
    query += ` WHERE g.semester = ?`;
    params.push(semester);
  }
  if (academicYear) {
    if (params.length > 0) query += ` AND g.academicYear = ?`;
    else query += ` WHERE g.academicYear = ?`;
    params.push(academicYear);
  }

  query += ` GROUP BY s.id, s.name, s.code ORDER BY avgGrade ASC`;

  const [report] = await connection.query(query, params);

  const reportWithPassRate = report.map((r) => ({
    ...r,
    passRate: r.count > 0 ? Math.round((r.passCount / r.count) * 100) : 0,
  }));

  res.json({ success: true, data: reportWithPassRate });
});

// POST /api/admin/users — Create student/admin
const createUser = asyncHandler(async (req, res) => {
  const { studentId, firstName, lastName, email, password, program, yearLevel, role } = req.body;

  if (!studentId || !firstName || !lastName || !email || !password) {
    throw new AppError(
      'studentId, firstName, lastName, email and password are all required',
      400
    );
  }

  const connection = await connectDB();

  // Check duplicate
  const [existing] = await connection.query(
    'SELECT id FROM users WHERE studentId = ? OR email = ?',
    [studentId.toUpperCase(), email.toLowerCase()]
  );

  if (existing.length > 0) {
    throw new AppError('Student ID or email already exists', 400);
  }

  // Hash password
  const hashedPassword = await bcryptjs.hash(password, 12);

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
      role || 'student',
      true,
    ]
  );

  const [newUser] = await connection.query(
    'SELECT id, studentId, firstName, lastName, email, role, program, yearLevel FROM users WHERE id = ?',
    [result.insertId]
  );

  res.status(201).json({
    success: true,
    data: newUser[0],
    message: 'Student added successfully!',
  });
});

// PUT /api/admin/users/:id — Update student
const updateUser = asyncHandler(async (req, res) => {
  const { password, ...updates } = req.body;

  const connection = await connectDB();

  const updateFields = Object.keys(updates)
    .map((key) => `${key} = ?`)
    .join(', ');
  const updateValues = Object.values(updates);

  if (!updateFields) {
    throw new AppError('No fields to update', 400);
  }

  updateValues.push(req.params.id);

  await connection.query(`UPDATE users SET ${updateFields} WHERE id = ?`, updateValues);

  const [user] = await connection.query(
    'SELECT id, studentId, firstName, lastName, email, role, program, yearLevel FROM users WHERE id = ?',
    [req.params.id]
  );

  if (user.length === 0) {
    throw new AppError('User not found', 404);
  }

  res.json({ success: true, data: user[0], message: 'Student updated successfully!' });
});

// PUT /api/admin/users/:id/role
const changeUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!role) throw new AppError('Role is required', 400);

  const connection = await connectDB();

  await connection.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);

  const [user] = await connection.query(
    'SELECT id, studentId, firstName, lastName, email, role FROM users WHERE id = ?',
    [req.params.id]
  );

  if (user.length === 0) throw new AppError('User not found', 404);

  res.json({ success: true, data: user[0] });
});

module.exports = {
  getAdminDashboard,
  getEnrollmentReport,
  getGradesReport,
  createUser,
  updateUser,
  changeUserRole,
};