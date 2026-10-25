const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');
const Team = require('../models/Team');

const protectTeacher = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      
      if (decoded.role !== 'teacher') {
        return res.status(403).json({ message: 'Access denied: Teacher privileges required' });
      }

      req.teacher = await Teacher.findById(decoded.id).select('-password');
      if (!req.teacher) {
        return res.status(401).json({ message: 'Teacher account no longer exists' });
      }

      return next();
    } catch (error) {
      console.error('Teacher auth error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }
};

const protectTeamLead = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

      if (decoded.role !== 'team_lead') {
        return res.status(403).json({ message: 'Access denied: Team Lead privileges required' });
      }

      const team = await Team.findById(decoded.teamId);
      if (!team) {
        return res.status(401).json({ message: 'Team record not found or has been deleted' });
      }

      req.team = team;
      req.teamLeadEmail = decoded.email;
      return next();
    } catch (error) {
      console.error('Team lead auth error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }
};

module.exports = {
  protectTeacher,
  protectTeamLead,
};

