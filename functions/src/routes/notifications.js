const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/authMiddleware');
const { getFirestore } = require('../config/firebase-functions');

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get user's notifications
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const db = getFirestore();

    // Build query
    let query = db.collection('notifications')
      .where('userId', '==', uid)
      .orderBy('createdAt', 'desc');

    if (unreadOnly === 'true') {
      query = query.where('read', '==', false);
    }

    // Apply pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const notificationsSnapshot = await query
      .limit(parseInt(limit))
      .offset(offset)
      .get();

    const notifications = [];
    notificationsSnapshot.forEach(doc => {
      notifications.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Get total count for pagination
    const totalSnapshot = await db.collection('notifications')
      .where('userId', '==', uid)
      .count()
      .get();

    const totalCount = totalSnapshot.data().count;

    res.json({
      success: true,
      data: notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        totalPages: Math.ceil(totalCount / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get notifications',
    });
  }
});

// @route   POST /api/notifications
// @desc    Create a new notification
// @access  Private
router.post('/', [
  authenticateToken,
  body('type').isIn(['friend_request', 'friend_request_accepted', 'milestone_achieved', 'system', 'reminder', 'support']),
  body('title').trim().isLength({ min: 1, max: 100 }),
  body('message').trim().isLength({ min: 1, max: 500 }),
  body('data').optional().isObject(),
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
    const { type, title, message, data } = req.body;
    const db = getFirestore();

    // Create notification
    const notification = {
      userId: uid,
      type,
      title,
      message,
      data: data || {},
      read: false,
      createdAt: new Date(),
    };

    const docRef = await db.collection('notifications').add(notification);

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: {
        id: docRef.id,
        ...notification,
      },
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create notification',
    });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { id } = req.params;
    const db = getFirestore();

    // Get the notification
    const notificationDoc = await db.collection('notifications').doc(id).get();
    
    if (!notificationDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found',
      });
    }

    const notification = notificationDoc.data();
    
    // Verify ownership
    if (notification.userId !== uid) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to modify this notification',
      });
    }

    // Mark as read
    await db.collection('notifications').doc(id).update({
      read: true,
      readAt: new Date(),
    });

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: {
        id,
        read: true,
        readAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark notification as read',
    });
  }
});

// @route   POST /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.post('/read-all', authenticateToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const db = getFirestore();

    // Get all unread notifications
    const unreadNotifications = await db
      .collection('notifications')
      .where('userId', '==', uid)
      .where('read', '==', false)
      .get();

    // Mark all as read
    const batch = db.batch();
    unreadNotifications.docs.forEach(doc => {
      batch.update(doc.ref, {
        read: true,
        readAt: new Date(),
      });
    });

    await batch.commit();

    res.json({
      success: true,
      message: `${unreadNotifications.docs.length} notifications marked as read`,
      data: {
        count: unreadNotifications.docs.length,
      },
    });
  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark notifications as read',
    });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete a notification
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { id } = req.params;
    const db = getFirestore();

    // Get the notification
    const notificationDoc = await db.collection('notifications').doc(id).get();
    
    if (!notificationDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found',
      });
    }

    const notification = notificationDoc.data();
    
    // Verify ownership
    if (notification.userId !== uid) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this notification',
      });
    }

    // Delete notification
    await db.collection('notifications').doc(id).delete();

    res.json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete notification',
    });
  }
});

// @route   DELETE /api/notifications
// @desc    Delete all notifications
// @access  Private
router.delete('/', authenticateToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { readOnly = false } = req.query;
    const db = getFirestore();

    // Build query
    let query = db.collection('notifications').where('userId', '==', uid);
    
    if (readOnly === 'true') {
      query = query.where('read', '==', true);
    }

    const notificationsSnapshot = await query.get();

    // Delete notifications
    const batch = db.batch();
    notificationsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    res.json({
      success: true,
      message: `${notificationsSnapshot.docs.length} notifications deleted successfully`,
      data: {
        count: notificationsSnapshot.docs.length,
      },
    });
  } catch (error) {
    console.error('Delete all notifications error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete notifications',
    });
  }
});

// @route   GET /api/notifications/unread-count
// @desc    Get unread notification count
// @access  Private
router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const db = getFirestore();

    const unreadSnapshot = await db
      .collection('notifications')
      .where('userId', '==', uid)
      .where('read', '==', false)
      .count()
      .get();

    const unreadCount = unreadSnapshot.data().count;

    res.json({
      success: true,
      data: {
        unreadCount,
      },
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get unread count',
    });
  }
});

// @route   GET /api/notifications/settings
// @desc    Get user's notification settings
// @access  Private
router.get('/settings', authenticateToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const db = getFirestore();

    // Get user's notification settings
    const userDoc = await db.collection('users').doc(uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const userData = userDoc.data();
    const notificationSettings = userData.notificationSettings || {
      friendRequests: true,
      milestoneAchievements: true,
      dailyReminders: true,
      weeklyReports: true,
      systemUpdates: true,
      pushNotifications: true,
      emailNotifications: false,
    };

    res.json({
      success: true,
      data: notificationSettings,
    });
  } catch (error) {
    console.error('Get notification settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get notification settings',
    });
  }
});

// @route   PUT /api/notifications/settings
// @desc    Update user's notification settings
// @access  Private
router.put('/settings', [
  authenticateToken,
  body('friendRequests').optional().isBoolean(),
  body('milestoneAchievements').optional().isBoolean(),
  body('dailyReminders').optional().isBoolean(),
  body('weeklyReports').optional().isBoolean(),
  body('systemUpdates').optional().isBoolean(),
  body('pushNotifications').optional().isBoolean(),
  body('emailNotifications').optional().isBoolean(),
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
    const updateData = req.body;
    const db = getFirestore();

    // Update notification settings
    await db.collection('users').doc(uid).update({
      notificationSettings: updateData,
      updatedAt: new Date(),
    });

    res.json({
      success: true,
      message: 'Notification settings updated successfully',
      data: updateData,
    });
  } catch (error) {
    console.error('Update notification settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update notification settings',
    });
  }
});

// @route   POST /api/notifications/test
// @desc    Send a test notification
// @access  Private
router.post('/test', authenticateToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const db = getFirestore();

    // Create test notification
    const testNotification = {
      userId: uid,
      type: 'system',
      title: 'Test Notification',
      message: 'This is a test notification to verify your notification system is working.',
      data: {
        test: true,
        timestamp: new Date().toISOString(),
      },
      read: false,
      createdAt: new Date(),
    };

    const docRef = await db.collection('notifications').add(testNotification);

    res.status(201).json({
      success: true,
      message: 'Test notification sent successfully',
      data: {
        id: docRef.id,
        ...testNotification,
      },
    });
  } catch (error) {
    console.error('Send test notification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send test notification',
    });
  }
});

module.exports = router;
