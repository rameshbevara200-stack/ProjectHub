const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema(
  {
    technicalApproach: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },
    idea: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },
    designThinking: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },
    uiUx: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },
    totalScore: {
      type: Number,
      required: true,
    },
    feedback: {
      type: String,
      trim: true,
      default: '',
    },
    evaluatedAt: {
      type: Date,
      default: Date.now,
    },
    evaluatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
    },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    abstract: {
      type: String,
      required: [true, 'Project abstract / overview is required'],
      trim: true,
    },
    technologies: {
      type: [String],
      default: [],
    },
    repoUrl: {
      type: String,
      trim: true,
    },
    liveDemoUrl: {
      type: String,
      trim: true,
    },
    projectFileUrl: {
      type: String,
      trim: true,
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: [true, 'Team reference is required'],
      unique: true, // One project per team
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
      required: true,
    },
    yearId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Year',
      required: true,
    },
    status: {
      type: String,
      enum: ['unrated', 'rated'],
      default: 'unrated',
    },
    evaluation: {
      type: evaluationSchema,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);

