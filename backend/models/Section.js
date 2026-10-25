const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Section or Branch name is required (e.g. CSE-A, ECE-B)'],
      trim: true,
    },
    yearId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Year',
      required: [true, 'Year reference is required'],
    },
  },
  { timestamps: true }
);

// Ensure unique section name per year
sectionSchema.index({ name: 1, yearId: 1 }, { unique: true });

module.exports = mongoose.model('Section', sectionSchema);

