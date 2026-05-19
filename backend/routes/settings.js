const express = require('express');
const router  = express.Router();
const {
  getProfile,
  updateProfile,
  changePassword,
  getNotificationPrefs,
  updateNotificationPrefs,
  getThemePrefs,
  updateThemePrefs,
} = require('../controllers/settingsController');
const { protect } = require('../middleware/auth');

router.use(protect); // all settings routes require login

router.get('/profile',       getProfile);
router.put('/profile',       updateProfile);
router.put('/password',      changePassword);
router.get('/notifications', getNotificationPrefs);
router.put('/notifications', updateNotificationPrefs);
router.get('/theme',         getThemePrefs);
router.put('/theme',         updateThemePrefs);

module.exports = router;
