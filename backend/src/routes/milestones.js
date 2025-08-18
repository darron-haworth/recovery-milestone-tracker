const express = require('express');
const router = express.Router();

// @route   GET /api/milestones
// @desc    Get user's milestones
// @access  Private
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Milestones endpoint - coming soon',
  });
});

// @route   POST /api/milestones
// @desc    Create a new milestone
// @access  Private
router.post('/', (req, res) => {
  res.json({
    success: true,
    message: 'Create milestone endpoint - coming soon',
  });
});

module.exports = router;
