const express = require('express');
const router = express.Router();
const {
  registerTeacher,
  loginTeacher,
  loginTeamLead,
  registerStudentTeam,
  getTeacherProfile,
} = require('../controllers/authController');
const { protectTeacher } = require('../middleware/authMiddleware');

// Teacher auth
router.post('/teacher/register', registerTeacher);
router.post('/teacher/login', loginTeacher);
router.get('/teacher/me', protectTeacher, getTeacherProfile);

// Team lead auth (Self-registration & Login)
router.post('/team/register', registerStudentTeam);
router.post('/team-lead/login', loginTeamLead);

module.exports = router;

