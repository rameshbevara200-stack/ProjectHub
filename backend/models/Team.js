const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    rollNumber: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
  },
  { _id: false }
);

const teamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: [true, 'Team name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    yearId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Year',
      required: [true, 'Year reference is required'],
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Section',
      required: [true, 'Section reference is required'],
    },
    members: {
      type: [memberSchema],
      default: [],
    },
    teamLead: {
      name: {
        type: String,
        required: [true, 'Team lead name is required'],
        trim: true,
      },
      email: {
        type: String,
        required: [true, 'Team lead email is required'],
        unique: true,
        lowercase: true,
        trim: true,
      },
      password: {
        type: String,
        required: true,
      },
      // Stored for teacher portal reference view as required
      generatedPassword: {
        type: String,
        default: '(Self registered)',
      },
    },
    isSubmitted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

teamSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.teamLead.password);
};

module.exports = mongoose.model('Team', teamSchema);

