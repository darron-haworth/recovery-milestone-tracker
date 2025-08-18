const express = require('express');
const router = express.Router();

// @route   GET /api/notifications
// @desc    Get user's notifications
// @access  Private
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Notifications endpoint - coming soon',
  });
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', (req, res) => {
  res.json({
    success: true,
    message: 'Mark notification read endpoint - coming soon',
  });
});

module.exports = router;
