const express = require('express');
const router  = express.Router();
const {
  getFacultyDashboard,
  getFacultySubjects,
  getSubjectStudents,
  updateStudentGrade,
} = require('../controllers/facultyController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('faculty', 'admin')); // faculty or admin

router.get('/dashboard',                        getFacultyDashboard);
router.get('/subjects',                         getFacultySubjects);
router.get('/subjects/:subjectId/students',     getSubjectStudents);
router.put('/grades/:gradeId',                  updateStudentGrade);

module.exports = router;