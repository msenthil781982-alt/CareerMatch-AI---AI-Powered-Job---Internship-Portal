const Application = require('../models/Application');
const Job = require('../models/Job');
const StudentProfile = require('../models/StudentProfile');
const User = require('../models/User');

// @desc    Apply to a job
// @route   POST /api/applications
// @access  Private (Student)
const applyToJob = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.status !== 'active') {
      return res.status(400).json({ success: false, message: 'This job is no longer accepting applications' });
    }

    // Check deadline
    if (job.deadline && new Date() > new Date(job.deadline)) {
      return res.status(400).json({ success: false, message: 'Application deadline has passed' });
    }

    // Check duplicate
    const existing = await Application.findOne({ studentId: req.user._id, jobId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already applied to this job' });
    }

    // Get student profile for resume and match score
    const profile = await StudentProfile.findOne({ userId: req.user._id });
    if (!profile?.resume?.filename) {
      return res.status(400).json({ success: false, message: 'Please upload your resume before applying' });
    }

    // Calculate match score
    let matchScore = 0, matchedSkills = [], missingSkills = [];
    if (profile.skills.length > 0 && job.requiredSkills.length > 0) {
      const studentSkillsLower = profile.skills.map(s => s.toLowerCase());
      matchedSkills = job.requiredSkills.filter(s => studentSkillsLower.includes(s.toLowerCase()));
      missingSkills = job.requiredSkills.filter(s => !studentSkillsLower.includes(s.toLowerCase()));
      matchScore = Math.round((matchedSkills.length / job.requiredSkills.length) * 100);
    }

    const application = await Application.create({
      studentId: req.user._id,
      jobId,
      resume: { filename: profile.resume.filename, path: profile.resume.path },
      coverLetter,
      matchScore,
      matchedSkills,
      missingSkills,
      statusHistory: [{ status: 'applied', updatedAt: new Date() }]
    });

    // Increment application count on job
    await Job.findByIdAndUpdate(jobId, { $inc: { applicationCount: 1 } });

    res.status(201).json({ success: true, message: 'Application submitted successfully', application });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already applied to this job' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get my applications (student)
// @route   GET /api/applications/my
// @access  Private (Student)
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user._id })
      .populate({
        path: 'jobId',
        populate: { path: 'recruiterProfile', select: 'companyName logo' }
      })
      .sort('-appliedAt');

    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
const getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('jobId')
      .populate('studentId', 'name email');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update application status (recruiter)
// @route   PATCH /api/applications/:id/status
// @access  Private (Recruiter)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, note } = req.body;

    const validStatuses = ['applied', 'under-review', 'shortlisted', 'interview', 'selected', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const application = await Application.findById(req.params.id).populate('jobId');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Verify recruiter owns the job
    if (application.jobId.recruiterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    application.status = status;
    application.statusHistory.push({ status, updatedAt: new Date(), note });
    if (note) application.recruiterNotes = note;

    await application.save();

    res.json({ success: true, message: 'Application status updated', application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get applicants for a job (recruiter)
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter)
const getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.recruiterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('studentId', 'name email phone location profilePhoto')
      .sort('-matchScore');

    // Get student profiles for skills
    const applicantsWithProfiles = await Promise.all(applications.map(async (app) => {
      const StudentProfile = require('../models/StudentProfile');
      const profile = await StudentProfile.findOne({ userId: app.studentId._id });
      return { ...app.toObject(), studentProfile: profile };
    }));

    res.json({ success: true, applications: applicantsWithProfiles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { applyToJob, getMyApplications, getApplication, updateApplicationStatus, getJobApplicants };
