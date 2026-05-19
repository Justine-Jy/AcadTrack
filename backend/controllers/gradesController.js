const connectDB = require('../config/database');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

// @route GET /api/grades/me
const getMyGrades = asyncHandler(async (req, res) => {
  const { semester, academicYear } = req.query;
  const connection = await connectDB();

  let query = 'SELECT g.id, g.student, g.subject, g.semester, g.academicYear, g.grade, g.remarks, g.midtermGrade, g.finalGrade, g.progress, s.code, s.name, s.units, s.type FROM grades g LEFT JOIN subjects s ON g.subject = s.id WHERE g.student = ?';
  const params = [req.user.id];

  if (semester) {
    query += ' AND g.semester = ?';
    params.push(semester);
  }
  if (academicYear) {
    query += ' AND g.academicYear = ?';
    params.push(academicYear);
  }

  query += ' ORDER BY g.semester';

  const [grades] = await connection.query(query, params);

  // Group by semester
  const grouped = {};
  grades.forEach((g) => {
    const key = `${g.semester} ${g.academicYear}`;
    if (!grouped[key]) {
      grouped[key] = {
        semester: g.semester,
        academicYear: g.academicYear,
        courses: [],
        totalUnits: 0,
        gpa: null,
      };
    }
    grouped[key].courses.push(g);
  });

  // Calculate GPA per semester
  Object.values(grouped).forEach((sem) => {
    const graded = sem.courses.filter((c) => c.grade && c.remarks !== 'Dropped');
    if (graded.length > 0) {
      const totalUnits = graded.reduce((s, c) => s + (c.units || 0), 0);
      const weightedSum = graded.reduce((s, c) => s + (c.grade * (c.units || 0)), 0);
      sem.gpa = totalUnits ? (weightedSum / totalUnits).toFixed(2) : null;
      sem.totalUnits = totalUnits;
    }
  });

  res.json({
    success: true,
    data: {
      grades,
      grouped: Object.values(grouped),
    },
  });
});

// @route GET /api/grades/me/gpa
const getMyGPA = asyncHandler(async (req, res) => {
  const connection = await connectDB();

  const [grades] = await connection.query(
    'SELECT g.grade, s.units FROM grades g LEFT JOIN subjects s ON g.subject = s.id WHERE g.student = ? AND g.grade IS NOT NULL AND g.remarks NOT IN ("Dropped", "In Progress")',
    [req.user.id]
  );

  if (grades.length === 0) {
    return res.json({
      success: true,
      data: {
        cumulativeGpa: null,
        totalUnits: 0,
      },
    });
  }

  const totalUnits = grades.reduce((s, g) => s + (g.units || 0), 0);
  const weightedSum = grades.reduce((s, g) => s + (g.grade * (g.units || 0)), 0);
  const cumulativeGpa = (weightedSum / totalUnits).toFixed(2);

  res.json({
    success: true,
    data: {
      cumulativeGpa,
      totalUnits,
    },
  });
});

// @route PUT /api/grades/:id — Admin/Faculty posts/edits a grade
const postGrade = asyncHandler(async (req, res) => {
  const { midtermGrade, finalGrade, grade, remarks, progress } = req.body;
  const connection = await connectDB();

  // Get grade record
  const [gradeRecords] = await connection.query(
    'SELECT id, enrollment FROM grades WHERE id = ?',
    [req.params.id]
  );

  if (gradeRecords.length === 0) {
    throw new AppError('Grade record not found', 404);
  }

  const gradeRecord = gradeRecords[0];

  // Build dynamic update query
  const updates = {};
  if (midtermGrade !== undefined && midtermGrade !== '')
    updates.midtermGrade = parseFloat(midtermGrade);
  if (finalGrade !== undefined && finalGrade !== '')
    updates.finalGrade = parseFloat(finalGrade);
  if (grade !== undefined && grade !== '') {
    updates.grade = parseFloat(grade);
    updates.remarks = parseFloat(grade) <= 3.0 ? 'Passed' : 'Failed';
  }
  if (remarks !== undefined && remarks !== '') updates.remarks = remarks;
  if (progress !== undefined && progress !== '') updates.progress = parseInt(progress);

  updates.postedBy = req.user.id;
  updates.postedAt = new Date();

  const updateFields = Object.keys(updates)
    .map((key) => `${key} = ?`)
    .join(', ');
  const updateValues = Object.values(updates);
  updateValues.push(req.params.id);

  await connection.query(`UPDATE grades SET ${updateFields} WHERE id = ?`, updateValues);

  // If grade was posted, update enrollment status
  if (grade !== undefined && grade !== '') {
    const newStatus = parseFloat(grade) <= 3.0 ? 'completed' : 'failed';
    await connection.query('UPDATE enrollments SET status = ? WHERE id = ?', [
      newStatus,
      gradeRecord.enrollment,
    ]);
  }

  // Return updated grade
  const [updated] = await connection.query(
    'SELECT g.id, g.student, g.subject, g.grade, g.remarks, g.midtermGrade, g.finalGrade, g.progress, u.studentId, u.firstName, u.lastName, s.code, s.name, s.units FROM grades g LEFT JOIN users u ON g.student = u.id LEFT JOIN subjects s ON g.subject = s.id WHERE g.id = ?',
    [req.params.id]
  );

  res.json({
    success: true,
    data: updated[0],
    message: 'Grade saved successfully',
  });
});

// @route GET /api/grades/subject/:subjectId — All grades for a subject
const getSubjectGrades = asyncHandler(async (req, res) => {
  const connection = await connectDB();

  const [grades] = await connection.query(
    'SELECT g.id, g.student, g.subject, g.grade, g.remarks, u.studentId, u.firstName, u.lastName, s.code, s.name, s.units FROM grades g JOIN users u ON g.student = u.id JOIN subjects s ON g.subject = s.id WHERE g.subject = ? ORDER BY u.studentId',
    [req.params.subjectId]
  );

  res.json({
    success: true,
    count: grades.length,
    data: grades,
  });
});

module.exports = { getMyGrades, getMyGPA, postGrade, getSubjectGrades };