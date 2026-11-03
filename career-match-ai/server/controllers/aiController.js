const axios = require('axios');
const StudentProfile = require('../models/StudentProfile');
const Job = require('../models/Job');

// Local fallback matching algorithm
const localMatch = (studentSkills, requiredSkills) => {
  if (!requiredSkills || requiredSkills.length === 0) {
    return { matchScore: 100, matchedSkills: [], missingSkills: [], recommendations: [] };
  }

  const studentSkillsLower = (studentSkills || []).map(s => s.toLowerCase().trim());
  const matchedSkills = [];
  const missingSkills = [];

  for (const skill of requiredSkills) {
    const skillLower = skill.toLowerCase().trim();
    // Check for exact or partial match
    const matched = studentSkillsLower.some(ss =>
      ss === skillLower || ss.includes(skillLower) || skillLower.includes(ss)
    );

    if (matched) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }

  const matchScore = Math.round((matchedSkills.length / requiredSkills.length) * 100);
  const recommendations = missingSkills.slice(0, 3).map(s => `Learn ${s} to improve your match`);

  return {
    matchScore,
    matchedSkills,
    missingSkills,
    recommendations,
    explanation: `You match ${matchedSkills.length} out of ${requiredSkills.length} required skills.`
  };
};

// @desc    Get AI match score for student vs job
// @route   POST /api/ai/match
// @access  Private (Student)
const getMatchScore = async (req, res) => {
  try {
    const { jobId, studentSkills: providedSkills } = req.body;

    let studentSkills = providedSkills;
    let job = null;

    // Get student skills from profile if not provided
    if (!studentSkills) {
      const profile = await StudentProfile.findOne({ userId: req.user._id });
      studentSkills = profile?.skills || [];
    }

    // Get job required skills
    if (jobId) {
      job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }
    }

    const requiredSkills = req.body.requiredSkills || job?.requiredSkills || [];

    if (requiredSkills.length === 0) {
      return res.json({ success: true, matchScore: 0, matchedSkills: [], missingSkills: [], recommendations: [] });
    }

    // Try AI service first, fall back to local
    try {
      const AI_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
      const response = await axios.post(`${AI_URL}/match`, {
        studentSkills,
        requiredSkills
      }, { timeout: 5000 });

      return res.json({ success: true, ...response.data });
    } catch (aiError) {
      // AI service not available, use local algorithm
      console.log('AI service unavailable, using local matching');
      const result = localMatch(studentSkills, requiredSkills);
      return res.json({ success: true, ...result, source: 'local' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get AI recommendations
// @route   POST /api/ai/recommendations
// @access  Private (Student)
const getRecommendations = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user._id });
    const studentSkills = profile?.skills || [];

    const jobs = await Job.find({ status: 'active' })
      .populate('recruiterProfile', 'companyName logo')
      .limit(30);

    const scored = jobs.map(job => {
      const result = localMatch(studentSkills, job.requiredSkills);
      return { job, ...result };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);

    res.json({ success: true, recommendations: scored.slice(0, 10) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMatchScore, getRecommendations };
