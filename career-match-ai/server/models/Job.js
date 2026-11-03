const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recruiterProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'RecruiterProfile' },
  title: { type: String, required: true, trim: true },
  type: { type: String, enum: ['full-time', 'part-time', 'internship', 'contract', 'freelance'], required: true },
  description: { type: String, required: true },
  responsibilities: { type: [String], default: [] },
  requiredSkills: { type: [String], default: [], required: true },
  preferredSkills: { type: [String], default: [] },
  location: { type: String, required: true },
  workMode: { type: String, enum: ['remote', 'on-site', 'hybrid'], default: 'on-site' },
  experience: { type: String, default: 'Fresher' },
  salaryMin: { type: Number },
  salaryMax: { type: Number },
  salaryType: { type: String, enum: ['monthly', 'yearly', 'stipend', 'hourly'], default: 'yearly' },
  deadline: { type: Date },
  status: { type: String, enum: ['active', 'inactive', 'closed'], default: 'active' },
  applicationCount: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  companyName: { type: String },
  companyLogo: { type: String, default: '' }
}, { timestamps: true });

// Index for search
jobSchema.index({ title: 'text', description: 'text', requiredSkills: 'text' });
jobSchema.index({ type: 1, status: 1, location: 1 });

module.exports = mongoose.model('Job', jobSchema);
