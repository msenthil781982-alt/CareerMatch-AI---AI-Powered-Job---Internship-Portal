const StudentProfile = require('../models/StudentProfile');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// @desc    Get student profile
// @route   GET /api/students/profile
// @access  Private (Student)
const getProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user._id });
    const user = await User.findById(req.user._id);

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    res.json({ success: true, profile, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update student profile
// @route   PUT /api/students/profile
// @access  Private (Student)
const updateProfile = async (req, res) => {
  try {
    const {
      headline, bio, college, degree, graduationYear, gpa,
      skills, education, projects, experience, certifications,
      careerInterests, preferredJobType, preferredLocation, preferredWorkMode,
      socialLinks, name, phone, location
    } = req.body;

    // Update user info
    await User.findByIdAndUpdate(req.user._id, { name, phone, location });

    // Check profile completeness
    const isComplete = !!(college && degree && skills?.length > 0 && graduationYear);

    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.user._id },
      {
        headline, bio, college, degree, graduationYear, gpa,
        skills, education, projects, experience, certifications,
        careerInterests, preferredJobType, preferredLocation, preferredWorkMode,
        socialLinks, profileComplete: isComplete
      },
      { new: true, upsert: true }
    );

    res.json({ success: true, message: 'Profile updated successfully', profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Upload resume
// @route   POST /api/students/resume
// @access  Private (Student)
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const profile = await StudentProfile.findOne({ userId: req.user._id });

    // Delete old resume if exists
    if (profile?.resume?.path) {
      const oldPath = path.join(__dirname, '..', profile.resume.path);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const resumeData = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: `uploads/resumes/${req.file.filename}`,
      uploadDate: new Date(),
      size: req.file.size
    };

    await StudentProfile.findOneAndUpdate(
      { userId: req.user._id },
      { resume: resumeData },
      { upsert: true }
    );

    res.json({
      success: true,
      message: 'Resume uploaded successfully',
      resume: resumeData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete resume
// @route   DELETE /api/students/resume
// @access  Private (Student)
const deleteResume = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user._id });

    if (profile?.resume?.path) {
      const filePath = path.join(__dirname, '..', profile.resume.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await StudentProfile.findOneAndUpdate(
      { userId: req.user._id },
      { $unset: { resume: 1 } }
    );

    res.json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get recommended jobs based on skills
// @route   GET /api/students/recommendations
// @access  Private (Student)
const getRecommendations = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user._id });

    if (!profile || profile.skills.length === 0) {
      // Return top jobs if no skills
      const jobs = await Job.find({ status: 'active' })
        .populate('recruiterProfile', 'companyName logo')
        .sort('-createdAt')
        .limit(10);
      return res.json({ success: true, recommendations: jobs.map(j => ({ job: j, matchScore: 0, matchedSkills: [], missingSkills: [] })) });
    }

    const jobs = await Job.find({ status: 'active' })
      .populate('recruiterProfile', 'companyName logo')
      .limit(50);

    const AI_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

    const recommendations = await Promise.all(jobs.map(async (job) => {
      try {
        const response = await axios.post(`${AI_URL}/match`, {
          studentSkills: profile.skills,
          requiredSkills: job.requiredSkills
        }, { timeout: 5000 });

        return {
          job,
          matchScore: response.data.matchScore,
          matchedSkills: response.data.matchedSkills,
          missingSkills: response.data.missingSkills
        };
      } catch {
        // Fallback local matching
        const studentSkillsLower = profile.skills.map(s => s.toLowerCase());
        const matched = job.requiredSkills.filter(s => studentSkillsLower.includes(s.toLowerCase()));
        const missing = job.requiredSkills.filter(s => !studentSkillsLower.includes(s.toLowerCase()));
        const score = job.requiredSkills.length ? Math.round((matched.length / job.requiredSkills.length) * 100) : 0;
        return { job, matchScore: score, matchedSkills: matched, missingSkills: missing };
      }
    }));

    recommendations.sort((a, b) => b.matchScore - a.matchScore);

    res.json({ success: true, recommendations: recommendations.slice(0, 15) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Save/unsave a job
// @route   POST /api/students/saved-jobs/:jobId
// @access  Private (Student)
const toggleSavedJob = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user._id });
    const jobId = req.params.jobId;

    const isSaved = profile.savedJobs.includes(jobId);

    if (isSaved) {
      await StudentProfile.findOneAndUpdate({ userId: req.user._id }, { $pull: { savedJobs: jobId } });
      res.json({ success: true, message: 'Job removed from saved', saved: false });
    } else {
      await StudentProfile.findOneAndUpdate({ userId: req.user._id }, { $addToSet: { savedJobs: jobId } });
      res.json({ success: true, message: 'Job saved successfully', saved: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get saved jobs
// @route   GET /api/students/saved-jobs
// @access  Private (Student)
const getSavedJobs = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user._id })
      .populate({ path: 'savedJobs', populate: { path: 'recruiterProfile', select: 'companyName logo' } });

    res.json({ success: true, savedJobs: profile?.savedJobs || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProfile, updateProfile, uploadResume, deleteResume, getRecommendations, toggleSavedJob, getSavedJobs };
