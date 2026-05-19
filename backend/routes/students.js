const express = require('express');
const router = express.Router();
const { getAllStudents, getStudent, updateStudent, deactivateStudent } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/',                getAllStudents);
router.get('/:id',             getStudent);
router.put('/:id',             updateStudent);
router.put('/:id/deactivate',  deactivateStudent);

module.exports = router;