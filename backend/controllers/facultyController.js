const connectDB = require('../config/database');
const { asyncHandler, AppError } = require('../middleware/errorHandler');

// @route GET /api/faculty/dashboard
const getFacultyDashboard = asyncHandler(async (req, res) => {
  const facultyName = `${req.user.firstName} ${req.user.lastName}`;
  const connection = await connectDB();

  // Find subjects taught by this faculty
  const [mySubjects] = await connection.query(
    'SELECT id, code, name, units, type, schedule, instructorName, maxSlots, currentSlots FROM subjects WHERE instructorName LIKE ?',
    [`%${req.user.firstName}%`]
  );

  const subjectIds = mySubjects.map((s) => s.id);

  if (subjectIds.length === 0) {
    return res.json({
      success: true,
      data: {
        stats: {
          totalSubjectsTaught: 0,
          totalStudents: 0,
          totalEnrollments: 0,
          subjectsWithGrades: 0,
        },
        subjectStats: [],
        todayClasses: [],
        today: '',
        recentGrades: [],
      },
    });
  }

  // Get enrollments
  const [enrollments] = await connection.query(
    `SELECT e.id, e.subject, e.student, u.studentId, u.firstName, u.lastName, s.code, s.name
     FROM enrollments e
     JOIN subjects s ON e.subject = s.id
     JOIN users u ON e.student = u.id
     WHERE e.subject IN (${subjectIds.join(',')}) AND e.status = 'enrolled'`
  );

  // Get grades
  const [grades] = await connection.query(
    `SELECT g.id, g.subject, g.student, g.grade, s.code, s.name, s.units
     FROM grades g
     JOIN subjects s ON g.subject = s.id
     WHERE g.subject IN (${subjectIds.join(',')}) AND g.grade IS NOT NULL`
  );

  // Get recent grades
  const [recentGrades] = await connection.query(
    `SELECT g.id, g.subject, g.grade, g.updatedAt, u.studentId, u.firstName, u.lastName, s.code, s.name
     FROM grades g
     JOIN subjects s ON g.subject = s.id
     JOIN users u ON g.student = u.id
     WHERE g.subject IN (${subjectIds.join(',')})
     ORDER BY g.updatedAt DESC
     LIMIT 10`
  );

  // Calculate subject stats
  const subjectStats = mySubjects.map((subj) => {
    const enrolled = enrollments.filter((e) => e.subject === subj.id);
    const subjectGrades = grades.filter((g) => g.subject === subj.id);
    const avgGrade =
      subjectGrades.length > 0
        ? (subjectGrades.reduce((s, g) => s + g.grade, 0) / subjectGrades.length).toFixed(2)
        : null;
    const passing = subjectGrades.filter((g) => g.grade <= 3.0).length;

    return {
      id: subj.id,
      code: subj.code,
      name: subj.name,
      units: subj.units,
      type: subj.type,
      enrolledCount: enrolled.length,
      maxSlots: subj.maxSlots,
      avgGrade,
      passingCount: passing,
      gradedCount: subjectGrades.length,
    };
  });

  // Get today's classes
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = dayNames[new Date().getDay()];

  const [todaySchedules] = await connection.query(
    `SELECT s.code, s.name, sch.room, sch.startTime, sch.endTime, s.type,
            (SELECT COUNT(*) FROM enrollments e WHERE e.subject = s.id AND e.status = 'enrolled') as enrolledCount
     FROM subjects s
     LEFT JOIN schedules sch ON s.id = sch.subjectId
     WHERE s.instructorName LIKE ? AND sch.day = ?
     ORDER BY sch.startTime`,
    [`%${req.user.firstName}%`, today]
  );

  // Get unique students
  const uniqueStudentIds = new Set(enrollments.map((e) => e.student));

  res.json({
    success: true,
    data: {
      stats: {
        totalSubjectsTaught: mySubjects.length,
        totalStudents: uniqueStudentIds.size,
        totalEnrollments: enrollments.length,
        subjectsWithGrades: subjectStats.filter((s) => s.gradedCount > 0).length,
      },
      subjectStats,
      todayClasses: todaySchedules,
      today,
      recentGrades,
    },
  });
});

// @route GET /api/faculty/subjects
const getFacultySubjects = asyncHandler(async (req, res) => {
  const connection = await connectDB();

  const [subjects] = await connection.query(
    'SELECT id, code, name, description, units, type, instructorName, maxSlots, currentSlots, isOpen FROM subjects WHERE instructorName LIKE ?',
    [`%${req.user.firstName}%`]
  );

  res.json({ success: true, count: subjects.length, data: subjects });
});

// @route GET /api/faculty/subjects/:subjectId/students
const getSubjectStudents = asyncHandler(async (req, res) => {
  const { subjectId } = req.params;
  const connection = await connectDB();

  const [enrollments] = await connection.query(
    'SELECT e.id, u.id as userId, u.studentId, u.firstName, u.lastName, u.email, u.program, u.yearLevel FROM enrollments e JOIN users u ON e.student = u.id WHERE e.subject = ? AND e.status = "enrolled"',
    [subjectId]
  );

  // Get grades for these students
  const [grades] = await connection.query(
    'SELECT student, grade, remarks, progress, midtermGrade, finalGrade FROM grades WHERE subject = ?',
    [subjectId]
  );

  const gradeMap = {};
  grades.forEach((g) => {
    gradeMap[g.student] = g;
  });

  const students = enrollments.map((e) => ({
    ...e,
    gradeRecord: gradeMap[e.userId] || null,
  }));

  res.json({ success: true, count: students.length, data: students });
});

// @route PUT /api/faculty/grades/:gradeId
const updateStudentGrade = asyncHandler(async (req, res) => {
  const { midtermGrade, finalGrade, grade, remarks, progress } = req.body;
  const connection = await connectDB();

  // Get grade record
  const [gradeRecords] = await connection.query(
    'SELECT id, subject FROM grades WHERE id = ?',
    [req.params.gradeId]
  );

  if (gradeRecords.length === 0) {
    throw new AppError('Grade record not found', 404);
  }

  // Check if faculty teaches this subject
  const [subject] = await connection.query(
    'SELECT instructorName FROM subjects WHERE id = ?',
    [gradeRecords[0].subject]
  );

  if (
    subject.length === 0 ||
    !subject[0].instructorName.toLowerCase().includes(req.user.firstName.toLowerCase())
  ) {
    throw new AppError('Not authorized to update grades for this subject', 403);
  }

  // Build update query
  const updates = {};
  if (midtermGrade !== undefined) updates.midtermGrade = midtermGrade;
  if (finalGrade !== undefined) updates.finalGrade = finalGrade;
  if (grade !== undefined) {
    updates.grade = grade;
    updates.remarks = grade <= 3.0 ? 'Passed' : 'Failed';
  }
  if (remarks !== undefined) updates.remarks = remarks;
  if (progress !== undefined) updates.progress = progress;

  updates.postedBy = req.user.id;
  updates.postedAt = new Date();

  const updateFields = Object.keys(updates)
    .map((key) => `${key} = ?`)
    .join(', ');
  const updateValues = Object.values(updates);
  updateValues.push(req.params.gradeId);

  await connection.query(`UPDATE grades SET ${updateFields} WHERE id = ?`, updateValues);

  const [updated] = await connection.query(
    'SELECT id, student, subject, grade, remarks, progress, midtermGrade, finalGrade FROM grades WHERE id = ?',
    [req.params.gradeId]
  );

  res.json({ success: true, data: updated[0] });
});

module.exports = {
  getFacultyDashboard,
  getFacultySubjects,
  getSubjectStudents,
  updateStudentGrade,
};