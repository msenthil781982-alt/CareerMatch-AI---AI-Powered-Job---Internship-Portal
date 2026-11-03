const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getProfile, updateProfile, uploadResume, deleteResume,
  getRecommendations, toggleSavedJob, getSavedJobs
} = require('../controllers/studentController');

router.use(protect, authorize('student'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/resume', upload.single('resume'), uploadResume);
router.delete('/resume', deleteResume);
router.get('/recommendations', getRecommendations);
router.post('/saved-jobs/:jobId', toggleSavedJob);
router.get('/saved-jobs', getSavedJobs);

module.exports = router;
