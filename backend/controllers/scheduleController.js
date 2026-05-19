const connectDB = require('../config/database');
const { asyncHandler } = require('../middleware/errorHandler');

const getMySchedule = asyncHandler(async (req, res) => {
  const { semester, academicYear } = req.query;
  const connection = await connectDB();

  let query = `
    SELECT e.id, e.subject, s.code, s.name, s.units, s.type, s.instructorName,
           sch.day, sch.startTime, sch.endTime, sch.room
    FROM enrollments e
    JOIN subjects s ON e.subject = s.id
    LEFT JOIN schedules sch ON s.id = sch.subjectId
    WHERE e.student = ? AND e.status = 'enrolled'
  `;
  const params = [req.user.id];

  if (semester) {
    query += ' AND e.semester = ?';
    params.push(semester);
  }
  if (academicYear) {
    query += ' AND e.academicYear = ?';
    params.push(academicYear);
  }

  query += ' ORDER BY sch.day, sch.startTime';

  const [scheduleData] = await connection.query(query, params);

  // Build timetable by day
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const timetable = {};
  days.forEach((d) => {
    timetable[d] = [];
  });

  scheduleData.forEach((slot) => {
    if (slot.day && timetable[slot.day]) {
      timetable[slot.day].push({
        subjectId: slot.subject,
        code: slot.code,
        name: slot.name,
        instructor: slot.instructorName,
        startTime: slot.startTime,
        endTime: slot.endTime,
        room: slot.room,
        type: slot.type,
      });
    }
  });

  // Sort by time
  days.forEach((d) => {
    timetable[d].sort((a, b) => a.startTime.localeCompare(b.startTime));
  });

  // Get today's classes
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = dayNames[new Date().getDay()];
  const todayClasses = timetable[today] || [];

  // Get enrolled subjects
  let enrollQuery = `
    SELECT e.id, e.subject, s.code, s.name, s.units, s.type, s.instructorName
    FROM enrollments e
    JOIN subjects s ON e.subject = s.id
    WHERE e.student = ? AND e.status = 'enrolled'
  `;
  const enrollParams = [req.user.id];

  if (semester) {
    enrollQuery += ' AND e.semester = ?';
    enrollParams.push(semester);
  }
  if (academicYear) {
    enrollQuery += ' AND e.academicYear = ?';
    enrollParams.push(academicYear);
  }

  const [enrollments] = await connection.query(enrollQuery, enrollParams);

  res.json({
    success: true,
    data: {
      timetable,
      todayClasses,
      today,
      enrolledSubjects: enrollments.length,
    },
  });
});

module.exports = { getMySchedule };