const Job = require('../models/Job');
const RecruiterProfile = require('../models/RecruiterProfile');
const Application = require('../models/Application');
const User = require('../models/User');

// @desc    Get all jobs with filters
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    const {
      type, location, workMode, skills, experience,
      search, sortBy, page = 1, limit = 12, minSalary, maxSalary
    } = req.query;

    const filter = { status: 'active' };

    if (type) filter.type = type;
    if (location && location !== 'all') filter.location = { $regex: location, $options: 'i' };
    if (workMode && workMode !== 'all') filter.workMode = workMode;
    if (experience && experience !== 'all') filter.experience = { $regex: experience, $options: 'i' };

    if (skills) {
      const skillsArr = skills.split(',').map(s => s.trim());
      filter.requiredSkills = { $in: skillsArr.map(s => new RegExp(s, 'i')) };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { requiredSkills: { $elemMatch: { $regex: search, $options: 'i' } } }
      ];
    }

    if (minSalary) filter.salaryMin = { $gte: Number(minSalary) };
    if (maxSalary) filter.salaryMax = { $lte: Number(maxSalary) };

    let sortOption = { createdAt: -1 };
    if (sortBy === 'salary') sortOption = { salaryMax: -1 };
    if (sortBy === 'deadline') sortOption = { deadline: 1 };
    if (sortBy === 'applications') sortOption = { applicationCount: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Job.countDocuments(filter);

    const jobs = await Job.find(filter)
      .populate('recruiterProfile', 'companyName logo industry companyDescription')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      jobs,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('recruiterProfile', 'companyName logo industry companyDescription website headquarters companySize founded');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Increment views
    job.views += 1;
    await job.save();

    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create job
// @route   POST /api/jobs
// @access  Private (Recruiter)
const createJob = async (req, res) => {
  try {
    const recruiterProfile = await RecruiterProfile.findOne({ userId: req.user._id });

    if (!recruiterProfile) {
      return res.status(400).json({ success: false, message: 'Please complete your company profile first' });
    }

    const jobData = {
      ...req.body,
      recruiterId: req.user._id,
      recruiterProfile: recruiterProfile._id,
      companyName: recruiterProfile.companyName,
      companyLogo: recruiterProfile.logo || ''
    };

    const job = await Job.create(jobData);

    res.status(201).json({ success: true, message: 'Job posted successfully', job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter)
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this job' });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.json({ success: true, message: 'Job updated successfully', job: updatedJob });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.recruiterId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this job' });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getJobs, getJob, createJob, updateJob, deleteJob };
