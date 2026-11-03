const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getStats, getUsers, getJobs, getApplications, toggleUserStatus } = require('../controllers/adminController');

router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.get('/jobs', getJobs);
router.get('/applications', getApplications);
router.patch('/users/:id/toggle', toggleUserStatus);

module.exports = router;
