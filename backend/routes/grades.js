const express = require('express');
const router = express.Router();
const { getMyGrades, getMyGPA, postGrade, getSubjectGrades } = require('../controllers/gradesController');
const { protect, authorize } = require('../middleware/auth');

router.get('/me',                  protect, getMyGrades);
router.get('/me/gpa',              protect, getMyGPA);
router.put('/:id',                 protect, authorize('admin', 'faculty'), postGrade);
router.get('/subject/:subjectId',  protect, authorize('admin', 'faculty'), getSubjectGrades);

module.exports = router;