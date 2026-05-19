const express = require('express');
const router = express.Router();
const { getStudentDashboard } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.get('/me', protect, getStudentDashboard);

module.exports = router;