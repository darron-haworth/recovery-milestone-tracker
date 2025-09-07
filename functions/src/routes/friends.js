const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/authMiddleware');
const { getFirestore } = require('../config/firebase-functions');

const router = express.Router();

// @route   GET /api/friends
// @desc    Get user's friends list
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const db = getFirestore();

    // Get user's friends
    const friendsSnapshot = await db
      .collection('friendships')
      .where('userId', '==', uid)
      .where('status', '==', 'accepted')
      .get();

    const friends = [];
    for (const doc of friendsSnapshot.docs) {
      const friendship = doc.data();
      const friendDoc = await db.collection('users').doc(friendship.friendId).get();
      
      if (friendDoc.exists) {
        const friendData = friendDoc.data();
        friends.push({
          id: doc.id,
          friendId: friendship.friendId,
          displayName: friendData.displayName,
          email: friendData.email,
          avatarUrl: friendData.avatarUrl,
          recoveryType: friendData.recoveryType,
          sobrietyDate: friendData.sobrietyDate,
          lastActive: friendData.lastActive,
          privacySettings: friendData.privacySettings,
          friendshipDate: friendship.createdAt,
        });
      }
    }

    res.json({
      success: true,
      data: friends,
      count: friends.length,
    });
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get friends list',
    });
  }
});

// @route   POST /api/friends
// @desc    Send friend request
// @access  Private
router.post('/', [
  authenticateToken,
  body('friendEmail').isEmail().normalizeEmail(),
  body('message').optional().trim().isLength({ max: 200 }),
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
    const { friendEmail, message } = req.body;
    const db = getFirestore();

    // Find user by email
    const usersSnapshot = await db
      .collection('users')
      .where('email', '==', friendEmail)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const friendDoc = usersSnapshot.docs[0];
    const friendId = friendDoc.id;

    // Check if trying to add self
    if (friendId === uid) {
      return res.status(400).json({
        success: false,
        error: 'Cannot add yourself as a friend',
      });
    }

    // Check if friendship already exists
    const existingFriendship = await db
      .collection('friendships')
      .where('userId', '==', uid)
      .where('friendId', '==', friendId)
      .limit(1)
      .get();

    if (!existingFriendship.empty) {
      const friendship = existingFriendship.docs[0].data();
      if (friendship.status === 'pending') {
        return res.status(400).json({
          success: false,
          error: 'Friend request already sent',
        });
      } else if (friendship.status === 'accepted') {
        return res.status(400).json({
          success: false,
          error: 'Already friends',
        });
      }
    }

    // Create friend request
    const friendRequest = {
      userId: uid,
      friendId,
      status: 'pending',
      message: message || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await db.collection('friendships').add(friendRequest);

    // Create notification for friend
    const notification = {
      userId: friendId,
      type: 'friend_request',
      title: 'New Friend Request',
      message: `${req.user.email} sent you a friend request`,
      data: {
        requestId: docRef.id,
        senderId: uid,
        senderEmail: req.user.email,
        message: friendRequest.message,
      },
      read: false,
      createdAt: new Date(),
    };

    await db.collection('notifications').add(notification);

    res.status(201).json({
      success: true,
      message: 'Friend request sent successfully',
      data: {
        requestId: docRef.id,
        friendId,
        status: 'pending',
      },
    });
  } catch (error) {
    console.error('Send friend request error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send friend request',
    });
  }
});

// @route   GET /api/friends/requests
// @desc    Get pending friend requests
// @access  Private
router.get('/requests', authenticateToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const db = getFirestore();

    // Get pending friend requests
    const requestsSnapshot = await db
      .collection('friendships')
      .where('friendId', '==', uid)
      .where('status', '==', 'pending')
      .get();

    const requests = [];
    for (const doc of requestsSnapshot.docs) {
      const request = doc.data();
      const senderDoc = await db.collection('users').doc(request.userId).get();
      
      if (senderDoc.exists) {
        const senderData = senderDoc.data();
        requests.push({
          id: doc.id,
          senderId: request.userId,
          senderEmail: senderData.email,
          senderDisplayName: senderData.displayName,
          senderAvatarUrl: senderData.avatarUrl,
          message: request.message,
          createdAt: request.createdAt,
        });
      }
    }

    res.json({
      success: true,
      data: requests,
      count: requests.length,
    });
  } catch (error) {
    console.error('Get friend requests error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get friend requests',
    });
  }
});

// @route   POST /api/friends/requests/:requestId/accept
// @desc    Accept friend request
// @access  Private
router.post('/requests/:requestId/accept', authenticateToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { requestId } = req.params;
    const db = getFirestore();

    // Get the friend request
    const requestDoc = await db.collection('friendships').doc(requestId).get();
    
    if (!requestDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Friend request not found',
      });
    }

    const request = requestDoc.data();
    
    // Verify the request is for the current user
    if (request.friendId !== uid) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to accept this request',
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Request is not pending',
      });
    }

    // Update the friendship status
    await db.collection('friendships').doc(requestId).update({
      status: 'accepted',
      updatedAt: new Date(),
    });

    // Create reverse friendship record
    await db.collection('friendships').add({
      userId: uid,
      friendId: request.userId,
      status: 'accepted',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create notification for sender
    const notification = {
      userId: request.userId,
      type: 'friend_request_accepted',
      title: 'Friend Request Accepted',
      message: `${req.user.email} accepted your friend request`,
      data: {
        friendId: uid,
        friendEmail: req.user.email,
      },
      read: false,
      createdAt: new Date(),
    };

    await db.collection('notifications').add(notification);

    res.json({
      success: true,
      message: 'Friend request accepted successfully',
    });
  } catch (error) {
    console.error('Accept friend request error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to accept friend request',
    });
  }
});

// @route   POST /api/friends/requests/:requestId/decline
// @desc    Decline friend request
// @access  Private
router.post('/requests/:requestId/decline', authenticateToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { requestId } = req.params;
    const db = getFirestore();

    // Get the friend request
    const requestDoc = await db.collection('friendships').doc(requestId).get();
    
    if (!requestDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Friend request not found',
      });
    }

    const request = requestDoc.data();
    
    // Verify the request is for the current user
    if (request.friendId !== uid) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to decline this request',
      });
    }

    // Delete the friend request
    await db.collection('friendships').doc(requestId).delete();

    res.json({
      success: true,
      message: 'Friend request declined successfully',
    });
  } catch (error) {
    console.error('Decline friend request error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to decline friend request',
    });
  }
});

// @route   DELETE /api/friends/:friendId
// @desc    Remove friend
// @access  Private
router.delete('/:friendId', authenticateToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { friendId } = req.params;
    const db = getFirestore();

    // Find and delete both friendship records
    const friendshipsSnapshot = await db
      .collection('friendships')
      .where('userId', 'in', [uid, friendId])
      .where('friendId', 'in', [uid, friendId])
      .where('status', '==', 'accepted')
      .get();

    const batch = db.batch();
    friendshipsSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    res.json({
      success: true,
      message: 'Friend removed successfully',
    });
  } catch (error) {
    console.error('Remove friend error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove friend',
    });
  }
});

// @route   GET /api/friends/suggestions
// @desc    Get friend suggestions based on recovery type and location
// @access  Private
router.get('/suggestions', authenticateToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const db = getFirestore();

    // Get current user's profile
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'User profile not found',
      });
    }

    const userData = userDoc.data();
    const userRecoveryType = userData.recoveryType;

    // Get existing friends to exclude them
    const friendsSnapshot = await db
      .collection('friendships')
      .where('userId', '==', uid)
      .get();

    const existingFriendIds = friendsSnapshot.docs.map(doc => doc.data().friendId);

    // Get suggestions based on recovery type
    let suggestionsQuery = db.collection('users')
      .where('recoveryType', '==', userRecoveryType)
      .limit(10);

    const suggestionsSnapshot = await suggestionsQuery.get();
    
    const suggestions = [];
    suggestionsSnapshot.docs.forEach(doc => {
      const suggestionData = doc.data();
      if (doc.id !== uid && !existingFriendIds.includes(doc.id)) {
        suggestions.push({
          id: doc.id,
          displayName: suggestionData.displayName,
          email: suggestionData.email,
          recoveryType: suggestionData.recoveryType,
          sobrietyDate: suggestionData.sobrietyDate,
          privacySettings: suggestionData.privacySettings,
        });
      }
    });

    res.json({
      success: true,
      data: suggestions,
      count: suggestions.length,
    });
  } catch (error) {
    console.error('Get friend suggestions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get friend suggestions',
    });
  }
});

module.exports = router;
