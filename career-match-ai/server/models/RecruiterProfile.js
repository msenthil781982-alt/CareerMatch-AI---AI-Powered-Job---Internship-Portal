const mongoose = require('mongoose');

const recruiterProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  companyName: { type: String, required: true, trim: true },
  companyDescription: { type: String, default: '' },
  website: { type: String, default: '' },
  industry: { type: String, default: '' },
  companySize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '500+'],
    default: '1-10'
  },
  founded: { type: String, default: '' },
  headquarters: { type: String, default: '' },
  logo: { type: String, default: '' },
  socialLinks: {
    linkedin: String,
    twitter: String
  },
  verified: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('RecruiterProfile', recruiterProfileSchema);
