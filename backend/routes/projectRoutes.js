const express = require('express');
const router = express.Router();
const {
  getPublicProjects,
  getProjectById,
  submitProject,
  getTeacherAllProjects,
  getTeacherPendingProjects,
  getTeacherUnratedProjects,
  getTeacherRatedProjects,
  rateProject,
} = require('../controllers/projectController');
const { protectTeacher, protectTeamLead } = require('../middleware/authMiddleware');

// Public showcase routes
router.get('/', getPublicProjects);
router.get('/:id', getProjectById);

// Team lead submission route (strictly one-time)
router.post('/submit', protectTeamLead, submitProject);

// Teacher portal views
router.get('/teacher/all', protectTeacher, getTeacherAllProjects);
router.get('/teacher/pending', protectTeacher, getTeacherPendingProjects);
router.get('/teacher/unrated', protectTeacher, getTeacherUnratedProjects);
router.get('/teacher/rated', protectTeacher, getTeacherRatedProjects);

// Teacher project evaluation
router.post('/:id/rate', protectTeacher, rateProject);

module.exports = router;

