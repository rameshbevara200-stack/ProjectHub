const Project = require('../models/Project');
const Team = require('../models/Team');
const { sendEmail } = require('../config/mailer');
const { evaluationResultTemplate } = require('../utils/emailTemplates');

/**
 * @desc   Get public projects list (with year and section filters)
 * @route  GET /api/projects
 * @access Public
 */
const getPublicProjects = async (req, res) => {
  try {
    const { yearId, sectionId, search } = req.query;
    const filter = {};

    if (yearId) filter.yearId = yearId;
    if (sectionId) filter.sectionId = sectionId;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { abstract: { $regex: search, $options: 'i' } },
        { technologies: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const projects = await Project.find(filter)
      .populate('teamId', 'teamName description members teamLead')
      .populate('yearId', 'name')
      .populate('sectionId', 'name')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Get single project preview/details
 * @route  GET /api/projects/:id
 * @access Public
 */
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('teamId', 'teamName description members teamLead')
      .populate('yearId', 'name')
      .populate('sectionId', 'name')
      .populate('evaluation.evaluatedBy', 'name department');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Upload/Submit project by Team Lead (One-Time Submission)
 * @route  POST /api/projects/submit
 * @access Private (Team Lead)
 */
const submitProject = async (req, res) => {
  try {
    const team = req.team;

    // Strict requirement: One time submission only!
    if (team.isSubmitted) {
      return res.status(400).json({
        message: 'Your team has already submitted the project. Submissions are strictly one-time only.',
      });
    }

    const existingProject = await Project.findOne({ teamId: team._id });
    if (existingProject) {
      return res.status(400).json({
        message: 'A submission already exists for this team.',
      });
    }

    const { title, abstract, technologies, repoUrl, liveDemoUrl, projectFileUrl } = req.body;

    if (!title || !abstract) {
      return res.status(400).json({ message: 'Project Title and Abstract are required.' });
    }

    // Process technologies tags if array or comma-separated string
    let techArray = [];
    if (Array.isArray(technologies)) {
      techArray = technologies;
    } else if (typeof technologies === 'string' && technologies.trim()) {
      techArray = technologies.split(',').map((t) => t.trim()).filter(Boolean);
    }

    // Create Project
    const project = await Project.create({
      title: title.trim(),
      abstract: abstract.trim(),
      technologies: techArray,
      repoUrl: repoUrl ? repoUrl.trim() : '',
      liveDemoUrl: liveDemoUrl ? liveDemoUrl.trim() : '',
      projectFileUrl: projectFileUrl ? projectFileUrl.trim() : '',
      teamId: team._id,
      yearId: team.yearId,
      sectionId: team.sectionId,
      status: 'unrated',
    });

    // Mark team as submitted
    team.isSubmitted = true;
    await team.save();

    res.status(201).json({
      message: 'Project submitted successfully! One-time submission recorded.',
      project,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Teacher Portal: All submitted projects (Year & Branch/Section filterable)
 * @route  GET /api/projects/teacher/all
 * @access Private (Teacher)
 */
const getTeacherAllProjects = async (req, res) => {
  try {
    const { yearId, sectionId } = req.query;
    const filter = {};
    if (yearId) filter.yearId = yearId;
    if (sectionId) filter.sectionId = sectionId;

    const projects = await Project.find(filter)
      .populate('teamId', 'teamName description members teamLead isSubmitted')
      .populate('yearId', 'name')
      .populate('sectionId', 'name')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Teacher Portal: Pending projects (Teams registered whose project is NOT submitted)
 * @route  GET /api/projects/teacher/pending
 * @access Private (Teacher)
 */
const getTeacherPendingProjects = async (req, res) => {
  try {
    const { yearId, sectionId } = req.query;
    const filter = { isSubmitted: false };
    if (yearId) filter.yearId = yearId;
    if (sectionId) filter.sectionId = sectionId;

    const pendingTeams = await Team.find(filter)
      .populate('yearId', 'name')
      .populate('sectionId', 'name')
      .sort({ createdAt: -1 });

    res.json(pendingTeams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Teacher Portal: Unrated projects (Submitted but not yet evaluated)
 * @route  GET /api/projects/teacher/unrated
 * @access Private (Teacher)
 */
const getTeacherUnratedProjects = async (req, res) => {
  try {
    const { yearId, sectionId } = req.query;
    const filter = { status: 'unrated' };
    if (yearId) filter.yearId = yearId;
    if (sectionId) filter.sectionId = sectionId;

    const unrated = await Project.find(filter)
      .populate('teamId', 'teamName description members teamLead')
      .populate('yearId', 'name')
      .populate('sectionId', 'name')
      .sort({ createdAt: -1 });

    res.json(unrated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Teacher Portal: Rated projects (Evaluated by teacher)
 * @route  GET /api/projects/teacher/rated
 * @access Private (Teacher)
 */
const getTeacherRatedProjects = async (req, res) => {
  try {
    const { yearId, sectionId } = req.query;
    const filter = { status: 'rated' };
    if (yearId) filter.yearId = yearId;
    if (sectionId) filter.sectionId = sectionId;

    const rated = await Project.find(filter)
      .populate('teamId', 'teamName description members teamLead')
      .populate('yearId', 'name')
      .populate('sectionId', 'name')
      .populate('evaluation.evaluatedBy', 'name department')
      .sort({ 'evaluation.evaluatedAt': -1 });

    res.json(rated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Teacher Portal: Evaluate / Rate a project
 * @route  POST /api/projects/:id/rate
 * @access Private (Teacher)
 */
const rateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { technicalApproach, idea, designThinking, uiUx, feedback } = req.body;

    // Validate scores
    const scores = [technicalApproach, idea, designThinking, uiUx].map(Number);
    if (scores.some((s) => isNaN(s) || s < 0 || s > 10)) {
      return res.status(400).json({
        message: 'Scores for Technical Approach, Idea, Design Thinking, and UI & UX must each be between 0 and 10.',
      });
    }

    const totalScore = scores.reduce((sum, val) => sum + val, 0);

    const project = await Project.findById(id).populate('teamId');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.evaluation = {
      technicalApproach: Number(technicalApproach),
      idea: Number(idea),
      designThinking: Number(designThinking),
      uiUx: Number(uiUx),
      totalScore,
      feedback: feedback ? feedback.trim() : '',
      evaluatedAt: new Date(),
      evaluatedBy: req.teacher._id,
    };

    project.status = 'rated';
    await project.save();

    // Trigger email to team lead with rating information & category breakdown
    const leadEmail = project.teamId?.teamLead?.email;
    const leadName = project.teamId?.teamLead?.name || 'Team Lead';
    const teamName = project.teamId?.teamName || 'Your Team';

    let mailResult = { success: false };
    if (leadEmail) {
      mailResult = await sendEmail({
        to: leadEmail,
        subject: `College Project Hub - Evaluation Results for "${project.title}"`,
        html: evaluationResultTemplate({
          teamLeadName: leadName,
          teamName: teamName,
          projectTitle: project.title,
          evaluation: project.evaluation,
        }),
        text: `Evaluation for "${project.title}":\nTechnical Approach: ${technicalApproach}/10\nIdea: ${idea}/10\nDesign Thinking: ${designThinking}/10\nUI & UX: ${uiUx}/10\nTotal Score: ${totalScore}/40\nFeedback: ${feedback || 'None'}`,
      });
    }

    res.json({
      message: mailResult.success
        ? 'Project evaluated successfully and score report dispatched to team lead.'
        : 'Project evaluated successfully. (Email notice: SMTP not configured or failed to deliver)',
      project,
      emailStatus: mailResult,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPublicProjects,
  getProjectById,
  submitProject,
  getTeacherAllProjects,
  getTeacherPendingProjects,
  getTeacherUnratedProjects,
  getTeacherRatedProjects,
  rateProject,
};

