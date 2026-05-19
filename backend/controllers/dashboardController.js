const connectDB = require('../config/database');
const { asyncHandler } = require('../middleware/errorHandler');

const getStudentDashboard = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const connection = await connectDB();

  // Get enrollments
  const [enrollments] = await connection.query(
    `SELECT e.id, e.subject, s.code, s.name, s.units, s.instructorName, s.type
     FROM enrollments e
     JOIN subjects s ON e.subject = s.id
     WHERE e.student = ? AND e.status = 'enrolled'`,
    [studentId]
  );

  // Get grades
  const [grades] = await connection.query(
    `SELECT g.id, g.subject, g.grade, g.remarks, g.progress, s.code, s.name, s.units
     FROM grades g
     LEFT JOIN subjects s ON g.subject = s.id
     WHERE g.student = ?`,
    [studentId]
  );

  // Get announcements
  const [announcements] = await connection.query(
    `SELECT id, title, content, type, createdAt, postedBy
     FROM announcements
     WHERE isActive = true
     AND (expiresAt IS NULL OR expiresAt > NOW())
     AND targetAudience IN ('all', 'students')
     ORDER BY isPinned DESC, createdAt DESC
     LIMIT 5`
  );

  // Calculate GPA
  const completedGrades = grades.filter(
    (g) => g.grade && !['Dropped', 'In Progress'].includes(g.remarks)
  );
  const totalUnits = completedGrades.reduce((s, g) => s + (g.units || 0), 0);
  const weightedSum = completedGrades.reduce(
    (s, g) => s + (g.grade * (g.units || 0)),
    0
  );
  const cumulativeGpa = totalUnits ? (weightedSum / totalUnits).toFixed(2) : null;

  // Current enrolled units
  const currentEnrolledUnits = enrollments.reduce((s, e) => s + (e.units || 0), 0);
  const pendingTasks = grades.filter((g) => g.remarks === 'In Progress').length;

  // Get today's classes from schedule
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = dayNames[new Date().getDay()];

  const [todaySchedules] = await connection.query(
    `SELECT s.code, s.name, s.instructorName, sch.room, sch.startTime, sch.endTime, s.type
     FROM enrollments e
     JOIN subjects s ON e.subject = s.id
     JOIN schedules sch ON s.id = sch.subjectId
     WHERE e.student = ? AND e.status = 'enrolled' AND sch.day = ?
     ORDER BY sch.startTime`,
    [studentId, today]
  );

  // Current subjects with progress
  const currentSubjects = enrollments.map((e) => {
    const gradeRecord = grades.find(
      (g) => g.subject === e.subject && g.remarks === 'In Progress'
    );
    return {
      code: e.code,
      name: e.name,
      instructor: e.instructorName,
      units: e.units,
      grade: gradeRecord?.grade || null,
      progress: gradeRecord?.progress || 0,
    };
  });

  res.json({
    success: true,
    data: {
      stats: {
        enrolledSubjects: enrollments.length,
        enrolledUnits: currentEnrolledUnits,
        cumulativeGpa,
        totalCompletedUnits: totalUnits,
        pendingTasks,
      },
      currentSubjects,
      todayClasses: todaySchedules,
      today,
      announcements,
    },
  });
});

module.exports = { getStudentDashboard };