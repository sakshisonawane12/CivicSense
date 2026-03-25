const express = require('express');
const router = express.Router();
const { getLeaderboard, getUserStats } = require('../controllers/rewardsController');
const { verifyToken } = require('../controllers/authController');

router.get('/leaderboard', getLeaderboard);
router.get('/my-stats', verifyToken, getUserStats);

module.exports = router;
