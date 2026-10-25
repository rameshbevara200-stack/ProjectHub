const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Teacher = require('../models/Teacher');
const Team = require('../models/Team');
const Year = require('../models/Year');
const Section = require('../models/Section');
const { sendEmail } = require('../config/mailer');
const { studentTeamRegistrationTemplate, facultyInvitationTemplate } = require('../utils/emailTemplates');

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
    expiresIn: '7d',
  });
};

/**
 * @desc   Check if faculty initial setup is needed (i.e. zero faculty exist)
 * @route  GET /api/auth/teacher/setup-status
 * @access Public
 */
const getFacultySetupStatus = async (req, res) => {
  try {
    const count = await Teacher.countDocuments();
    res.json({ needsInitialSetup: count === 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Initial master faculty setup (ONLY allowed when 0 faculty accounts exist)
 * @route  POST /api/auth/teacher/initial-setup
 * @access Public (Locked after 1st account)
 */
const initialFacultySetup = async (req, res) => {
  try {
    const count = await Teacher.countDocuments();
    if (count > 0) {
      return res.status(403).json({
        message: 'Initial faculty setup is completed. New faculty accounts can only be created from inside the Faculty Portal.',
      });
    }

    const { name, email, password, department } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const teacher = await Teacher.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      department: department ? department.trim() : 'Computer Science & Engineering',
    });

    res.status(201).json({
      _id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      department: teacher.department,
      token: generateToken({ id: teacher._id, role: 'teacher' }),
      message: 'Master faculty administrator account initialized.',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Create a Faculty Colleague (Internal: Protected by logged-in Faculty)
 * @route  POST /api/auth/teacher/colleagues
 * @access Private (Teacher Only)
 */
const createFacultyColleague = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Faculty Name, Email, and Initial Password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const existing = await Teacher.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ message: `A faculty account with email '${email}' already exists.` });
    }

    const colleague = await Teacher.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      department: department ? department.trim() : 'Computer Science & Engineering',
    });

    // Send invitation email with login credentials
    const portalUrl = `${req.protocol}://${req.get('host').replace(':5000', ':5173')}/teacher/login`;
    sendEmail({
      to: email.toLowerCase().trim(),
      subject: 'College Project Hub - Faculty Evaluator Credentials',
      html: facultyInvitationTemplate({
        facultyName: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        invitedBy: req.teacher?.name || 'Faculty Administration',
        department: colleague.department,
        portalUrl,
      }),
      text: `Hello ${name},\n\nYou have been enrolled as a Faculty Evaluator by ${req.teacher?.name}.\nLogin Email: ${email}\nInitial Password: ${password}\n\nLogin at: ${portalUrl}`,
    });

    res.status(201).json({
      message: `Faculty account created successfully for ${name}. Credentials have been dispatched to ${email}.`,
      colleague: {
        _id: colleague._id,
        name: colleague.name,
        email: colleague.email,
        department: colleague.department,
        createdAt: colleague.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Get list of all faculty colleagues
 * @route  GET /api/auth/teacher/colleagues
 * @access Private (Teacher Only)
 */
const getFacultyColleagues = async (req, res) => {
  try {
    const facultyList = await Teacher.find()
      .select('name email department createdAt')
      .sort({ createdAt: 1 });
    res.json(facultyList);
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
  getFacultySetupStatus,
  initialFacultySetup,
  createFacultyColleague,
  getFacultyColleagues,
  loginTeacher,
  loginTeamLead,
  registerStudentTeam,
  getTeacherProfile,
};

