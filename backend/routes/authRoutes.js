const express = require('express');
const router = express.Router();
const {
  getFacultySetupStatus,
  initialFacultySetup,
  createFacultyColleague,
  getFacultyColleagues,
  loginTeacher,
  loginTeamLead,
  registerStudentTeam,
  getTeacherProfile,
} = require('../controllers/authController');
const { protectTeacher } = require('../middleware/authMiddleware');

// Faculty setup status & initial one-time bootstrap (when 0 faculty exist)
router.get('/teacher/setup-status', getFacultySetupStatus);
router.post('/teacher/initial-setup', initialFacultySetup);

// Faculty Login & Profile
router.post('/teacher/login', loginTeacher);
router.get('/teacher/me', protectTeacher, getTeacherProfile);

// Faculty Internal Colleague Creation (Protected inside Faculty Portal)
router.get('/teacher/colleagues', protectTeacher, getFacultyColleagues);
router.post('/teacher/colleagues', protectTeacher, createFacultyColleague);

// Team lead auth (Self-registration & Login)
router.post('/team/register', registerStudentTeam);
router.post('/team-lead/login', loginTeamLead);

module.exports = router;

