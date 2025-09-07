const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken, optionalAuth } = require('../middleware/authMiddleware');
const { 
  getAuth, 
  getUserByUid, 
  updateUserProfile, 
  deleteUser,
  getFirestore 
} = require('../config/firebase-functions');

const router = express.Router();

console.log('Auth routes loaded');

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

    // Get Firebase Auth instance
    const auth = getAuth();
    const db = getFirestore();

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: displayName || null,
      emailVerified: false,
    });

    // Create user document in Firestore
    const userData = {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName || null,
      emailVerified: userRecord.emailVerified,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Add any additional user fields here
      recoveryStartDate: null,
      milestones: [],
      friends: [],
      settings: {
        notifications: true,
        privacy: 'friends',
        theme: 'light'
      }
    };

    await db.collection('users').doc(userRecord.uid).set(userData);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        emailVerified: userRecord.emailVerified,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle specific Firebase Auth errors
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({
        success: false,
        error: 'Email already exists',
      });
    } else if (error.code === 'auth/invalid-email') {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address',
      });
    } else if (error.code === 'auth/weak-password') {
      return res.status(400).json({
        success: false,
        error: 'Password is too weak',
      });
    }

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
  body('idToken').notEmpty(),
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

    const { idToken } = req.body;

    // Get Firebase Auth instance
    const auth = getAuth();
    const db = getFirestore();

    // Verify the Firebase ID token
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(idToken);
      console.log(`🔐 User authenticated successfully (UID: ${decodedToken.uid})`);
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    }

    // Get user data from Firestore
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    // Create a custom token for the user
    const customToken = await auth.createCustomToken(decodedToken.uid);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        displayName: decodedToken.name,
        emailVerified: decodedToken.email_verified,
        customToken,
        ...userData,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    
    // Handle specific Firebase Auth errors
    if (error.code === 'auth/invalid-id-token') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    } else if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        success: false,
        error: 'Token expired',
      });
    } else if (error.code === 'auth/user-disabled') {
      return res.status(401).json({
        success: false,
        error: 'Account has been disabled',
      });
    }

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

    // Get Firebase Auth instance
    const auth = getAuth();

    // Generate password reset link
    const resetLink = await auth.generatePasswordResetLink(email, {
      url: process.env.FRONTEND_URL || 'http://localhost:8081',
      handleCodeInApp: true,
    });

    // In a real implementation, you would send this link via email
    // For now, we'll return the link in the response for testing
    console.log('Password reset link:', resetLink);

    res.json({
      success: true,
      message: 'Password reset email sent',
      // Remove this in production - only for testing
      resetLink: process.env.NODE_ENV === 'development' ? resetLink : undefined,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    
    // Handle specific Firebase Auth errors
    if (error.code === 'auth/user-not-found') {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    } else if (error.code === 'auth/invalid-email') {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address',
      });
    }

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

    // Get Firebase Auth instance
    const auth = getAuth();
    const db = getFirestore();

    // Verify the email verification token
    const decodedToken = await auth.verifyIdToken(token);
    const uid = decodedToken.uid;

    // Update user email verification status
    await auth.updateUser(uid, {
      emailVerified: true,
    });

    // Update user document in Firestore
    await db.collection('users').doc(uid).update({
      emailVerified: true,
      updatedAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    console.error('Email verification error:', error);
    
    // Handle specific Firebase Auth errors
    if (error.code === 'auth/invalid-id-token') {
      return res.status(400).json({
        success: false,
        error: 'Invalid verification token',
      });
    } else if (error.code === 'auth/id-token-expired') {
      return res.status(400).json({
        success: false,
        error: 'Verification token expired',
      });
    }

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

    // Get Firebase Auth instance
    const auth = getAuth();
    const db = getFirestore();

    // Delete user data from Firestore
    await db.collection('users').doc(uid).delete();

    // Delete the Firebase Auth user
    await auth.deleteUser(uid);

    res.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Delete account error:', error);
    
    // Handle specific Firebase Auth errors
    if (error.code === 'auth/user-not-found') {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to delete account',
    });
  }
});

module.exports = router;
