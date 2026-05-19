const express = require('express');
const router = express.Router();
const { getMySchedule } = require('../controllers/scheduleController');
const { protect } = require('../middleware/auth');

router.get('/me', protect, getMySchedule);

module.exports = router;