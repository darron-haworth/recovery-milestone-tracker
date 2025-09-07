const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/authMiddleware');
const { getFirestore } = require('../config/firebase');

const router = express.Router();

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const db = getFirestore();
    
    const userDoc = await db.collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      // Return empty profile for new users
      return res.json({
        success: true,
        data: {
          uid,
          email: req.user.email,
          emailVerified: req.user.emailVerified,
          profile: {
            anonymousId: '',
            avatar: null,
            bio: '',
            program: 'Other',
            firstName: '',
            lastInitial: '',
            nickname: '',
            recoveryType: 'Alcoholism',
            sobrietyDate: null,
          },
        },
      });
    }

    const userData = userDoc.data();
    
    // Extract profile data from nested profile object (new schema format)
    const profileData = {
      firstName: userData.profile?.firstName || userData.firstName || '',
      lastInitial: userData.profile?.lastInitial || userData.lastInitial || '',
      nickname: userData.profile?.nickname || userData.nickname || '',
      recoveryType: userData.profile?.recoveryType || userData.recoveryType || 'Alcoholism',
      program: userData.profile?.program || userData.program || '',
      sobrietyDate: userData.profile?.sobrietyDate || userData.sobrietyDate || null,
    };
    
    res.json({
      success: true,
      data: {
        uid,
        email: req.user.email,
        emailVerified: req.user.emailVerified,
        profile: profileData,
      },
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user profile',
    });
  }
});

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  authenticateToken,
  body('profile').optional().isObject(),
  body('displayName').optional().trim().isLength({ min: 2, max: 50 }),
  body('bio').optional().trim().isLength({ max: 500 }),
  body('recoveryType').optional().isIn(['Alcoholism', 'Drug Addiction', 'Gambling', 'Other']),
  body('sobrietyDate').optional().isISO8601(),
  body('privacySettings').optional().isObject(),
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { uid } = req.user;
    const { profile, ...otherData } = req.body;
    const db = getFirestore();

    // Prepare update data for new schema format
    const updateData = {
      updatedAt: new Date(),
    };

    // Check if user document exists first
    const userDoc = await db.collection('users').doc(uid).get();
    const existingProfile = userDoc.exists ? userDoc.data().profile || {} : {};

    // If profile object is provided, merge it into the nested profile structure
    if (profile) {
      updateData.profile = {
        ...existingProfile,
        ...profile,
      };
    }

    // Add other direct fields (non-profile fields)
    Object.keys(otherData).forEach(key => {
      if (otherData[key] !== undefined && key !== 'profile') {
        updateData[key] = otherData[key];
      }
    });
    
    if (userDoc.exists) {
      // Document exists, update it
      await db.collection('users').doc(uid).update(updateData);
    } else {
      // Document doesn't exist, create it with the new schema format
      const newUserData = {
        uid,
        email: req.user.email,
        displayName: req.user.displayName || null,
        emailVerified: req.user.emailVerified || false,
        createdAt: new Date(),
        // Default profile structure for new users
        profile: {
          anonymousId: '',
          avatar: null,
          bio: '',
          fellowship: 'Other',
          firstName: '',
          lastInitial: '',
          nickname: '',
          recoveryType: 'Alcoholism',
          sobrietyDate: null,
          ...updateData.profile,
        },
        milestones: [],
        friends: [],
        settings: {
          notifications: true,
          privacy: 'friends',
          theme: 'light'
        },
        ...updateData,
      };
      await db.collection('users').doc(uid).set(newUserData);
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updateData,
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to update user profile',
      details: error.message,
    });
  }
});

// @route   PUT /api/user/privacy
// @desc    Update privacy settings
// @access  Private
router.put('/privacy', [
  authenticateToken,
  body('profileVisibility').optional().isIn(['public', 'friends', 'private']),
  body('milestoneVisibility').optional().isIn(['public', 'friends', 'private']),
  body('allowFriendRequests').optional().isBoolean(),
  body('showOnlineStatus').optional().isBoolean(),
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { uid } = req.user;
    const privacyData = req.body;
    const db = getFirestore();

    // Add updated timestamp
    privacyData.updatedAt = new Date();

    await db.collection('users').doc(uid).update({
      privacySettings: privacyData,
    });

    res.json({
      success: true,
      message: 'Privacy settings updated successfully',
      data: privacyData,
    });
  } catch (error) {
    console.error('Update privacy settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update privacy settings',
    });
  }
});

// @route   GET /api/user/stats
// @desc    Get user recovery statistics
// @access  Private
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const db = getFirestore();

    // Get user's milestones
    const milestonesSnapshot = await db
      .collection('milestones')
      .where('userId', '==', uid)
      .get();

    const milestones = [];
    milestonesSnapshot.forEach(doc => {
      milestones.push({ id: doc.id, ...doc.data() });
    });

    // Calculate statistics
    const totalMilestones = milestones.length;
    const achievedMilestones = milestones.filter(m => m.achieved).length;
    const currentStreak = milestones
      .filter(m => m.achieved)
      .sort((a, b) => new Date(b.achievedAt) - new Date(a.achievedAt))
      .length;

    res.json({
      success: true,
      data: {
        totalMilestones,
        achievedMilestones,
        currentStreak,
        milestones,
      },
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user statistics',
    });
  }
});

// @route   POST /api/user/avatar
// @desc    Upload user avatar
// @access  Private
router.post('/avatar', authenticateToken, async (req, res) => {
  try {
    // Note: In a real implementation, you would handle file upload here
    // For now, we'll return a mock response
    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        avatarUrl: 'https://example.com/avatar.jpg',
      },
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload avatar',
    });
  }
});

module.exports = router;
