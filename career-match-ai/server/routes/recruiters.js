const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getProfile, updateProfile, getMyJobs, getDashboard, getJobApplicants } = require('../controllers/recruiterController');

router.use(protect, authorize('recruiter'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/jobs', getMyJobs);
router.get('/dashboard', getDashboard);
router.get('/jobs/:jobId/applicants', getJobApplicants);

module.exports = router;
