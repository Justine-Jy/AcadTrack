const express = require('express');
const router = express.Router();
const { getMyEnrollments, enrollSubject, dropSubject, getAllEnrollments } = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/auth');

router.get('/all',      protect, authorize('admin'), getAllEnrollments);
router.get('/',         protect, getMyEnrollments);
router.post('/',        protect, authorize('student'), enrollSubject);
router.put('/:id/drop', protect, authorize('student'), dropSubject);

module.exports = router;