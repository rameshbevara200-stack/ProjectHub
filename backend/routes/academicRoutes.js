const express = require('express');
const router = express.Router();
const {
  getYears,
  createYear,
  deleteYear,
  getSectionsByYear,
  getAllSections,
  createSection,
  deleteSection,
  getTeams,
  createTeam,
  deleteTeam,
  getTeamLeadsData,
} = require('../controllers/academicController');
const { protectTeacher } = require('../middleware/authMiddleware');

// Public or Semi-public for selectors
router.get('/years', getYears);
router.get('/sections', getAllSections);
router.get('/sections/year/:yearId', getSectionsByYear);
router.get('/teams', getTeams);

// Teacher-protected Academic Management endpoints
router.post('/years', protectTeacher, createYear);
router.delete('/years/:id', protectTeacher, deleteYear);

router.post('/sections', protectTeacher, createSection);
router.delete('/sections/:id', protectTeacher, deleteSection);

router.post('/teams', protectTeacher, createTeam);
router.delete('/teams/:id', protectTeacher, deleteTeam);

// Year-wise team lead credentials view
router.get('/team-leads', protectTeacher, getTeamLeadsData);

module.exports = router;

