const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const Year = require('../models/Year');
const Section = require('../models/Section');
const Team = require('../models/Team');
const { sendEmail } = require('../config/mailer');
const { teamLeadCredentialsTemplate } = require('../utils/emailTemplates');
const {
  deleteTeamCascade,
  deleteSectionCascade,
  deleteYearCascade,
} = require('../utils/cascadeDelete');

// ========================
// YEAR CONTROLLERS
// ========================

const getYears = async (req, res) => {
  try {
    const years = await Year.find().sort({ createdAt: -1 });
    res.json(years);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createYear = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Year name is required' });
    }

    const existing = await Year.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: 'Year with this name already exists' });
    }

    const year = await Year.create({ name: name.trim(), description: description || '' });
    res.status(201).json(year);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteYear = async (req, res) => {
  try {
    const { id } = req.params;
    const year = await Year.findById(id);
    if (!year) {
      return res.status(404).json({ message: 'Year not found' });
    }

    await deleteYearCascade(id);
    res.json({ message: `Year '${year.name}' and all associated sections, teams, and submissions deleted successfully.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ========================
// SECTION CONTROLLERS
// ========================

const getSectionsByYear = async (req, res) => {
  try {
    const { yearId } = req.params;
    const sections = await Section.find({ yearId }).populate('yearId', 'name').sort({ name: 1 });
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllSections = async (req, res) => {
  try {
    const sections = await Section.find().populate('yearId', 'name').sort({ name: 1 });
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSection = async (req, res) => {
  try {
    const { name, yearId } = req.body;
    if (!name || !yearId) {
      return res.status(400).json({ message: 'Section name and Year ID are required' });
    }

    const yearExists = await Year.findById(yearId);
    if (!yearExists) {
      return res.status(404).json({ message: 'Selected Academic Year does not exist' });
    }

    const existing = await Section.findOne({ name: name.trim(), yearId });
    if (existing) {
      return res.status(400).json({ message: 'Section already exists in this academic year' });
    }

    const section = await Section.create({ name: name.trim(), yearId });
    res.status(201).json(section);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSection = async (req, res) => {
  try {
    const { id } = req.params;
    const section = await Section.findById(id);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    await deleteSectionCascade(id);
    res.json({ message: `Section '${section.name}' and all associated teams and projects deleted successfully.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ========================
// TEAM CONTROLLERS
// ========================

const getTeams = async (req, res) => {
  try {
    const { yearId, sectionId } = req.query;
    const filter = {};
    if (yearId) filter.yearId = yearId;
    if (sectionId) filter.sectionId = sectionId;

    const teams = await Team.find(filter)
      .populate('yearId', 'name')
      .populate('sectionId', 'name')
      .sort({ createdAt: -1 });

    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTeam = async (req, res) => {
  try {
    const { teamName, description, yearId, sectionId, members, leadName, leadEmail } = req.body;

    if (!teamName || !yearId || !sectionId || !leadName || !leadEmail) {
      return res.status(400).json({ message: 'Please provide team name, year, section, team lead name and email' });
    }

    // Verify Year & Section
    const section = await Section.findOne({ _id: sectionId, yearId });
    if (!section) {
      return res.status(400).json({ message: 'Invalid section or section does not belong to selected year' });
    }

    // Check if team lead email already registered anywhere
    const existingLead = await Team.findOne({ 'teamLead.email': leadEmail.toLowerCase().trim() });
    if (existingLead) {
      return res.status(400).json({ message: `A team lead with email '${leadEmail}' is already registered.` });
    }

    // Generate auto password (e.g. "Lead@a9f3")
    const generatedPassword = 'Ld' + crypto.randomBytes(3).toString('hex') + '!';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(generatedPassword, salt);

    const team = await Team.create({
      teamName: teamName.trim(),
      description: description ? description.trim() : '',
      yearId,
      sectionId,
      members: Array.isArray(members) ? members : [],
      teamLead: {
        name: leadName.trim(),
        email: leadEmail.toLowerCase().trim(),
        password: hashedPassword,
        generatedPassword: generatedPassword,
      },
    });

    // Send credentials via email automatically
    const portalUrl = `${req.protocol}://${req.get('host').replace(':5000', ':5173')}/upload`;
    const mailResult = await sendEmail({
      to: leadEmail.toLowerCase().trim(),
      subject: 'College Project Hub - Team Lead Login Credentials',
      html: teamLeadCredentialsTemplate({
        teamLeadName: leadName.trim(),
        teamName: teamName.trim(),
        email: leadEmail.toLowerCase().trim(),
        password: generatedPassword,
        portalUrl,
      }),
      text: `Hello ${leadName},\n\nYou have been assigned as Team Lead for ${teamName}.\nYour login credentials:\nEmail: ${leadEmail}\nPassword: ${generatedPassword}\n\nLogin at: ${portalUrl}`,
    });

    let feedbackMsg = 'Team created successfully!';
    if (mailResult.success) {
      feedbackMsg += ` Login credentials dispatched to ${leadEmail}.`;
    } else if (mailResult.notConfigured) {
      feedbackMsg += ` NOTE: Email not dispatched because SMTP credentials are not yet configured in backend/.env. (Password: ${generatedPassword})`;
    } else {
      feedbackMsg += ` NOTE: Email dispatch failed (${mailResult.error}). (Password: ${generatedPassword})`;
    }

    res.status(201).json({
      message: feedbackMsg,
      team,
      generatedPassword,
      emailStatus: mailResult,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    await deleteTeamCascade(id);
    res.json({ message: `Team '${team.teamName}' and its associated submission deleted successfully.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ========================
// TEAM LEAD DATA (YEAR WISE)
// ========================

const getTeamLeadsData = async (req, res) => {
  try {
    const { yearId } = req.query;
    const filter = {};
    if (yearId) filter.yearId = yearId;

    const teams = await Team.find(filter)
      .populate('yearId', 'name')
      .populate('sectionId', 'name')
      .select('teamName description teamLead members isSubmitted yearId sectionId createdAt')
      .sort({ createdAt: -1 });

    const leadsData = teams.map((t) => ({
      _id: t._id,
      teamName: t.teamName,
      leadName: t.teamLead.name,
      leadEmail: t.teamLead.email,
      credentials: t.teamLead.generatedPassword,
      year: t.yearId ? t.yearId.name : 'N/A',
      yearId: t.yearId ? t.yearId._id : null,
      section: t.sectionId ? t.sectionId.name : 'N/A',
      sectionId: t.sectionId ? t.sectionId._id : null,
      membersCount: t.members ? t.members.length : 0,
      isSubmitted: t.isSubmitted,
      createdAt: t.createdAt,
    }));

    res.json(leadsData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};

