const Year = require('../models/Year');
const Section = require('../models/Section');
const Team = require('../models/Team');
const Project = require('../models/Project');

/**
 * Cascade delete a Team:
 * 1. Deletes associated Project submission.
 * 2. Deletes Team (which embeds team lead credentials).
 */
const deleteTeamCascade = async (teamId) => {
  await Project.deleteMany({ teamId });
  const deletedTeam = await Team.findByIdAndDelete(teamId);
  return deletedTeam;
};

/**
 * Cascade delete a Section:
 * 1. Finds all teams in this section.
 * 2. Deletes all associated projects for these teams.
 * 3. Deletes all teams in the section.
 * 4. Deletes the Section itself.
 */
const deleteSectionCascade = async (sectionId) => {
  const teams = await Team.find({ sectionId });
  const teamIds = teams.map((t) => t._id);

  if (teamIds.length > 0) {
    await Project.deleteMany({ teamId: { $in: teamIds } });
    await Team.deleteMany({ sectionId });
  }

  const deletedSection = await Section.findByIdAndDelete(sectionId);
  return deletedSection;
};

/**
 * Cascade delete a Year:
 * 1. Deletes all projects under this year.
 * 2. Deletes all teams under this year.
 * 3. Deletes all sections under this year.
 * 4. Deletes the Year itself.
 */
const deleteYearCascade = async (yearId) => {
  await Project.deleteMany({ yearId });
  await Team.deleteMany({ yearId });
  await Section.deleteMany({ yearId });
  const deletedYear = await Year.findByIdAndDelete(yearId);
  return deletedYear;
};

module.exports = {
  deleteTeamCascade,
  deleteSectionCascade,
  deleteYearCascade,
};

