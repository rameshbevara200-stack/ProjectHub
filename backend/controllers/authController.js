const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Teacher = require('../models/Teacher');
const Team = require('../models/Team');
const Year = require('../models/Year');
const Section = require('../models/Section');
const { sendEmail } = require('../config/mailer');
const { studentTeamRegistrationTemplate } = require('../utils/emailTemplates');

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
    expiresIn: '7d',
  });
};

/**
 * @desc   Register or initialize teacher
 * @route  POST /api/auth/teacher/register
 * @access Public
 */
const registerTeacher = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const teacherExists = await Teacher.findOne({ email: email.toLowerCase() });
    if (teacherExists) {
      return res.status(400).json({ message: 'Teacher with this email already exists' });
    }

    const teacher = await Teacher.create({
      name,
      email: email.toLowerCase(),
      password,
      department: department || 'Engineering Faculty',
    });

    res.status(201).json({
      _id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      department: teacher.department,
      token: generateToken({ id: teacher._id, role: 'teacher' }),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Teacher login
 * @route  POST /api/auth/teacher/login
 * @access Public
 */
const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const teacher = await Teacher.findOne({ email: email.toLowerCase() });
    if (!teacher) {
      return res.status(401).json({ message: 'Invalid teacher email or password' });
    }

    const isMatch = await teacher.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid teacher email or password' });
    }

    res.json({
      _id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      department: teacher.department,
      token: generateToken({ id: teacher._id, role: 'teacher' }),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Team Lead Login & Verification
 * @route  POST /api/auth/team-lead/login
 * @access Public
 * Note: Follows exact specifications:
 * 1) Check if email exists. If not, return "you are not authorized".
 * 2) If email exists, check password. If wrong, return "your password is wrong just check that".
 * 3) If correct, return token and pre-fillable team info.
 */
const loginTeamLead = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Team lead email is required' });
    }

    // Step 1: Check if email is registered by teacher
    const team = await Team.findOne({ 'teamLead.email': email.toLowerCase() })
      .populate('yearId', 'name')
      .populate('sectionId', 'name');

    if (!team) {
      // Exact specification message
      return res.status(401).json({ message: 'you are not authorized' });
    }

    // Step 2: Check password
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const isMatch = await team.matchPassword(password);
    if (!isMatch) {
      // Exact specification message
      return res.status(401).json({ message: 'your password is wrong just check that' });
    }

    // Step 3: Success - return token & pre-filled info
    const token = generateToken({
      teamId: team._id,
      email: team.teamLead.email,
      role: 'team_lead',
    });

    res.json({
      token,
      team: {
        _id: team._id,
        teamName: team.teamName,
        description: team.description,
        year: team.yearId,
        section: team.sectionId,
        members: team.members,
        teamLead: {
          name: team.teamLead.name,
          email: team.teamLead.email,
        },
        isSubmitted: team.isSubmitted,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Get current logged in teacher profile
 * @route  GET /api/auth/teacher/me
 * @access Private (Teacher)
 */
const getTeacherProfile = async (req, res) => {
  res.json(req.teacher);
};

/**
 * @desc   Student Team Self-Registration
 * @route  POST /api/auth/team/register
 * @access Public
 */
const registerStudentTeam = async (req, res) => {
  try {
    const { teamName, description, yearId, sectionId, leadName, leadEmail, password, members } = req.body;

    // Validate required fields
    if (!teamName || !yearId || !sectionId || !leadName || !leadEmail || !password) {
      return res.status(400).json({
        message: 'Please provide Team Name, Academic Year, Section, Team Lead Name, Email, and Password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    // Verify Year & Section existence
    const year = await Year.findById(yearId);
    if (!year) {
      return res.status(400).json({ message: 'Selected Academic Year does not exist.' });
    }

    const section = await Section.findOne({ _id: sectionId, yearId });
    if (!section) {
      return res.status(400).json({ message: 'Selected Section does not belong to the selected Year.' });
    }

    // Check if team lead email already registered anywhere
    const existingLead = await Team.findOne({ 'teamLead.email': leadEmail.toLowerCase().trim() });
    if (existingLead) {
      return res.status(400).json({
        message: `A team with lead email '${leadEmail}' is already registered. Please log in instead.`,
      });
    }

    // Hash chosen password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Normalize members
    let memberList = [];
    if (Array.isArray(members)) {
      memberList = members;
    }

    // Create Team
    const team = await Team.create({
      teamName: teamName.trim(),
      description: description ? description.trim() : '',
      yearId,
      sectionId,
      members: memberList,
      teamLead: {
        name: leadName.trim(),
        email: leadEmail.toLowerCase().trim(),
        password: hashedPassword,
        generatedPassword: '(Self registered)',
      },
    });

    // Send confirmation email
    const portalUrl = `${req.protocol}://${req.get('host').replace(':5000', ':5173')}/upload`;
    sendEmail({
      to: leadEmail.toLowerCase().trim(),
      subject: `College Project Hub - Registration Confirmed for ${teamName.trim()}`,
      html: studentTeamRegistrationTemplate({
        teamLeadName: leadName.trim(),
        teamName: teamName.trim(),
        yearName: year.name,
        sectionName: section.name,
        email: leadEmail.toLowerCase().trim(),
        members: memberList,
        portalUrl,
      }),
      text: `Hello ${leadName},\n\nYour team ${teamName} has been successfully registered in College Project Hub.\nCohort: ${year.name}\nSection: ${section.name}\nEmail: ${leadEmail}\n\nLogin and submit your project at: ${portalUrl}`,
    });

    // Generate JWT token for immediate access
    const token = generateToken({
      teamId: team._id,
      email: team.teamLead.email,
      role: 'team_lead',
    });

    res.status(201).json({
      message: 'Team registered successfully! A confirmation receipt has been emailed.',
      token,
      team: {
        _id: team._id,
        teamName: team.teamName,
        description: team.description,
        year: { _id: year._id, name: year.name },
        section: { _id: section._id, name: section.name },
        members: team.members,
        teamLead: {
          name: team.teamLead.name,
          email: team.teamLead.email,
        },
        isSubmitted: false,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerTeacher,
  loginTeacher,
  loginTeamLead,
  registerStudentTeam,
  getTeacherProfile,
};

