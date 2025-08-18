const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, optionalAuth } = require('../middleware/authMiddleware');
const { 
  getAuth, 
  getUserByUid, 
  updateUserProfile, 
  deleteUser,
  getFirestore 
} = require('../config/firebase');

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('displayName').optional().trim().isLength({ min: 2, max: 50 }),
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

    const { email, password, displayName } = req.body;

    // Note: In a real implementation, you would create the user in Firebase Auth here
    // For now, we'll return a mock response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        uid: 'mock-user-id',
        email,
        displayName: displayName || null,
        emailVerified: false,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed',
    });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
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

    const { email, password } = req.body;

    // Note: In a real implementation, you would verify credentials with Firebase Auth here
    // For now, we'll return a mock response
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        uid: 'mock-user-id',
        email,
        displayName: 'Mock User',
        emailVerified: true,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication failed',
    });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail(),
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

    const { email } = req.body;

    // Note: In a real implementation, you would send a password reset email here
    res.json({
      success: true,
      message: 'Password reset email sent',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send password reset email',
    });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', [
  body('token').notEmpty(),
  body('password').isLength({ min: 6 }),
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

    const { token, password } = req.body;

    // Note: In a real implementation, you would verify the token and update the password here
    res.json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: 'Password reset failed',
    });
  }
});

// @route   POST /api/auth/verify-email
// @desc    Verify email with token
// @access  Public
router.post('/verify-email', [
  body('token').notEmpty(),
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

    const { token } = req.body;

    // Note: In a real implementation, you would verify the email token here
    res.json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Email verification failed',
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const { uid } = req.user;

    // Get user data from Firestore
    const db = getFirestore();
    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const userData = userDoc.data();

    res.json({
      success: true,
      data: {
        uid,
        email: req.user.email,
        emailVerified: req.user.emailVerified,
        ...userData,
      },
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user data',
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // Note: In a real implementation, you might want to invalidate tokens here
    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Logout failed',
    });
  }
});

// @route   DELETE /api/auth/account
// @desc    Delete user account
// @access  Private
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    const { uid } = req.user;

    // Delete user data from Firestore
    const db = getFirestore();
    await db.collection('users').doc(uid).delete();

    // Note: In a real implementation, you would also delete the Firebase Auth user here
    // await deleteUser(uid);

    res.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete account',
    });
  }
});

module.exports = router;
