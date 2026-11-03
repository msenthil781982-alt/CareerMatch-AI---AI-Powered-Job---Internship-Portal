const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getMatchScore, getRecommendations } = require('../controllers/aiController');

router.post('/match', protect, getMatchScore);
router.post('/recommendations', protect, authorize('student'), getRecommendations);

module.exports = router;
