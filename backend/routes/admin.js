const express = require('express');
const router  = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAdminDashboard,
  getEnrollmentReport,
  getGradesReport,
  createUser,
  updateUser,
  changeUserRole,
  getFacultyList,
} = require('../controllers/adminController');

router.use(protect, authorize('admin'));

router.get('/dashboard',          getAdminDashboard);
router.get('/faculty',            getFacultyList);
router.get('/reports/enrollment', getEnrollmentReport);
router.get('/reports/grades',     getGradesReport);
router.post('/users',             createUser);
router.put('/users/:id',          updateUser);
router.put('/users/:id/role',     changeUserRole);

module.exports = router;