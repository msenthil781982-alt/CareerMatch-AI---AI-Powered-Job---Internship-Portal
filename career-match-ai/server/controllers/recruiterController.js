const RecruiterProfile = require('../models/RecruiterProfile');
const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');

// @desc    Get recruiter profile
// @route   GET /api/recruiters/profile
// @access  Private (Recruiter)
const getProfile = async (req, res) => {
  try {
    const profile = await RecruiterProfile.findOne({ userId: req.user._id });
    const user = await User.findById(req.user._id);
    res.json({ success: true, profile, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update recruiter profile
// @route   PUT /api/recruiters/profile
// @access  Private (Recruiter)
const updateProfile = async (req, res) => {
  try {
    const { companyName, companyDescription, website, industry, companySize, founded, headquarters, socialLinks, name, phone, location } = req.body;

    await User.findByIdAndUpdate(req.user._id, { name, phone, location });

    const profile = await RecruiterProfile.findOneAndUpdate(
      { userId: req.user._id },
      { companyName, companyDescription, website, industry, companySize, founded, headquarters, socialLinks },
      { new: true, upsert: true }
    );

    res.json({ success: true, message: 'Profile updated', profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get recruiter's jobs
// @route   GET /api/recruiters/jobs
// @access  Private (Recruiter)
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user._id }).sort('-createdAt');
    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/recruiters/dashboard
// @access  Private (Recruiter)
const getDashboard = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user._id });
    const jobIds = jobs.map(j => j._id);

    const totalApplications = await Application.countDocuments({ jobId: { $in: jobIds } });
    const shortlisted = await Application.countDocuments({ jobId: { $in: jobIds }, status: 'shortlisted' });
    const interviews = await Application.countDocuments({ jobId: { $in: jobIds }, status: 'interview' });
    const selected = await Application.countDocuments({ jobId: { $in: jobIds }, status: 'selected' });
    const activeJobs = jobs.filter(j => j.status === 'active').length;

    // Applications over last 7 days
    const today = new Date();
    const weekData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const start = new Date(date.setHours(0, 0, 0, 0));
      const end = new Date(date.setHours(23, 59, 59, 999));
      const count = await Application.countDocuments({
        jobId: { $in: jobIds },
        appliedAt: { $gte: start, $lte: end }
      });
      weekData.push({ date: start.toLocaleDateString('en', { weekday: 'short' }), applications: count });
    }

    // Status distribution
    const statusDist = await Application.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalJobs: jobs.length,
        activeJobs,
        totalApplications,
        shortlisted,
        interviews,
        selected
      },
      weekData,
      statusDistribution: statusDist
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get applicants for recruiter's job
// @route   GET /api/recruiters/jobs/:jobId/applicants
// @access  Private (Recruiter)
const getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job || job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('studentId', 'name email phone location profilePhoto')
      .sort('-matchScore');

    const StudentProfile = require('../models/StudentProfile');
    const enriched = await Promise.all(applications.map(async app => {
      const profile = await StudentProfile.findOne({ userId: app.studentId._id });
      return { ...app.toObject(), studentProfile: profile };
    }));

    res.json({ success: true, applicants: enriched, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProfile, updateProfile, getMyJobs, getDashboard, getJobApplicants };
