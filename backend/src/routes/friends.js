const express = require('express');
const router = express.Router();

// @route   GET /api/friends
// @desc    Get user's friends list
// @access  Private
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Friends list endpoint - coming soon',
  });
});

// @route   POST /api/friends
// @desc    Add a new friend
// @access  Private
router.post('/', (req, res) => {
  res.json({
    success: true,
    message: 'Add friend endpoint - coming soon',
  });
});

module.exports = router;
