const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  resume: {
    filename: String,
    path: String
  },
  coverLetter: { type: String, default: '' },
  matchScore: { type: Number, default: 0 },
  matchedSkills: { type: [String], default: [] },
  missingSkills: { type: [String], default: [] },
  status: {
    type: String,
    enum: ['applied', 'under-review', 'shortlisted', 'interview', 'selected', 'rejected'],
    default: 'applied'
  },
  statusHistory: [{
    status: String,
    updatedAt: { type: Date, default: Date.now },
    note: String
  }],
  appliedAt: { type: Date, default: Date.now },
  recruiterNotes: { type: String, default: '' }
}, { timestamps: true });

// Prevent duplicate applications
applicationSchema.index({ studentId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
