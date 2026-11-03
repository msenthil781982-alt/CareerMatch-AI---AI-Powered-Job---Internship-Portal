const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  degree: String,
  field: String,
  institution: String,
  year: String,
  percentage: String
}, { _id: false });

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  techStack: [String],
  link: String
}, { _id: false });

const experienceSchema = new mongoose.Schema({
  company: String,
  role: String,
  duration: String,
  description: String
}, { _id: false });

const certificationSchema = new mongoose.Schema({
  name: String,
  issuer: String,
  year: String,
  link: String
}, { _id: false });

const studentProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  headline: { type: String, default: '' },
  bio: { type: String, default: '' },
  college: { type: String, default: '' },
  degree: { type: String, default: '' },
  graduationYear: { type: String, default: '' },
  gpa: { type: String, default: '' },
  skills: { type: [String], default: [] },
  education: { type: [educationSchema], default: [] },
  projects: { type: [projectSchema], default: [] },
  experience: { type: [experienceSchema], default: [] },
  certifications: { type: [certificationSchema], default: [] },
  careerInterests: { type: [String], default: [] },
  preferredJobType: { type: String, enum: ['full-time', 'part-time', 'internship', 'contract', 'any'], default: 'any' },
  preferredLocation: { type: String, default: '' },
  preferredWorkMode: { type: String, enum: ['remote', 'on-site', 'hybrid', 'any'], default: 'any' },
  resume: {
    filename: String,
    originalName: String,
    path: String,
    uploadDate: Date,
    size: Number
  },
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  socialLinks: {
    linkedin: String,
    github: String,
    portfolio: String
  },
  profileComplete: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
