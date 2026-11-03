const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getJobs, getJob, createJob, updateJob, deleteJob } = require('../controllers/jobController');

// Public routes
router.get('/', getJobs);
router.get('/:id', getJob);

// Protected routes
router.post('/', protect, authorize('recruiter', 'admin'), createJob);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);

module.exports = router;
