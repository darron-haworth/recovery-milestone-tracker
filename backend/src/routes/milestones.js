const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/authMiddleware');
const { getFirestore } = require('../config/firebase');

const router = express.Router();

// @route   GET /api/milestones
// @desc    Get user's milestones
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const db = getFirestore();

    // Get user's milestones
    const milestonesSnapshot = await db
      .collection('milestones')
      .where('userId', '==', uid)
      .orderBy('daysRequired', 'asc')
      .get();

    const milestones = [];
    milestonesSnapshot.forEach(doc => {
      milestones.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Get user's profile for sobriety date
    const userDoc = await db.collection('users').doc(uid).get();
    let currentDays = 0;
    let sobrietyDate = null;

    if (userDoc.exists) {
      const userData = userDoc.data();
      sobrietyDate = userData.sobrietyDate;
      
      if (sobrietyDate) {
        const now = new Date();
        const sobriety = new Date(sobrietyDate);
        currentDays = Math.floor((now - sobriety) / (1000 * 60 * 60 * 24));
      }
    }

    // Calculate progress for each milestone
    const milestonesWithProgress = milestones.map(milestone => {
      const progress = Math.min((currentDays / milestone.daysRequired) * 100, 100);
      const achieved = currentDays >= milestone.daysRequired;
      
      return {
        ...milestone,
        currentDays,
        progress: Math.round(progress),
        achieved,
        achievedAt: achieved && !milestone.achievedAt ? new Date() : milestone.achievedAt,
      };
    });

    res.json({
      success: true,
      data: milestonesWithProgress,
      currentDays,
      sobrietyDate,
      count: milestonesWithProgress.length,
    });
  } catch (error) {
    console.error('Get milestones error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get milestones',
    });
  }
});

// @route   POST /api/milestones
// @desc    Create a new milestone
// @access  Private
router.post('/', [
  authenticateToken,
  body('title').trim().isLength({ min: 1, max: 100 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('daysRequired').isInt({ min: 1, max: 36500 }), // Max 100 years
  body('category').optional().isIn(['daily', 'weekly', 'monthly', 'yearly', 'custom']),
  body('icon').optional().trim().isLength({ max: 50 }),
  body('color').optional().trim().isLength({ max: 7 }),
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
    const { title, description, daysRequired, category, icon, color } = req.body;
    const db = getFirestore();

    // Check if milestone with same title already exists
    const existingMilestone = await db
      .collection('milestones')
      .where('userId', '==', uid)
      .where('title', '==', title)
      .limit(1)
      .get();

    if (!existingMilestone.empty) {
      return res.status(400).json({
        success: false,
        error: 'Milestone with this title already exists',
      });
    }

    // Create milestone
    const milestone = {
      userId: uid,
      title,
      description: description || '',
      daysRequired,
      category: category || 'custom',
      icon: icon || 'star',
      color: color || '#007AFF',
      achieved: false,
      achievedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await db.collection('milestones').add(milestone);

    res.status(201).json({
      success: true,
      message: 'Milestone created successfully',
      data: {
        id: docRef.id,
        ...milestone,
      },
    });
  } catch (error) {
    console.error('Create milestone error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create milestone',
    });
  }
});

// @route   PUT /api/milestones/:id
// @desc    Update a milestone
// @access  Private
router.put('/:id', [
  authenticateToken,
  body('title').optional().trim().isLength({ min: 1, max: 100 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('daysRequired').optional().isInt({ min: 1, max: 36500 }),
  body('category').optional().isIn(['daily', 'weekly', 'monthly', 'yearly', 'custom']),
  body('icon').optional().trim().isLength({ max: 50 }),
  body('color').optional().trim().isLength({ max: 7 }),
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
    const { id } = req.params;
    const updateData = req.body;
    const db = getFirestore();

    // Get the milestone
    const milestoneDoc = await db.collection('milestones').doc(id).get();
    
    if (!milestoneDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Milestone not found',
      });
    }

    const milestone = milestoneDoc.data();
    
    // Verify ownership
    if (milestone.userId !== uid) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this milestone',
      });
    }

    // Check if title is being changed and if it conflicts
    if (updateData.title && updateData.title !== milestone.title) {
      const existingMilestone = await db
        .collection('milestones')
        .where('userId', '==', uid)
        .where('title', '==', updateData.title)
        .limit(1)
        .get();

      if (!existingMilestone.empty) {
        return res.status(400).json({
          success: false,
          error: 'Milestone with this title already exists',
        });
      }
    }

    // Update milestone
    updateData.updatedAt = new Date();
    await db.collection('milestones').doc(id).update(updateData);

    res.json({
      success: true,
      message: 'Milestone updated successfully',
      data: {
        id,
        ...milestone,
        ...updateData,
      },
    });
  } catch (error) {
    console.error('Update milestone error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update milestone',
    });
  }
});

// @route   DELETE /api/milestones/:id
// @desc    Delete a milestone
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { id } = req.params;
    const db = getFirestore();

    // Get the milestone
    const milestoneDoc = await db.collection('milestones').doc(id).get();
    
    if (!milestoneDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Milestone not found',
      });
    }

    const milestone = milestoneDoc.data();
    
    // Verify ownership
    if (milestone.userId !== uid) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this milestone',
      });
    }

    // Delete milestone
    await db.collection('milestones').doc(id).delete();

    res.json({
      success: true,
      message: 'Milestone deleted successfully',
    });
  } catch (error) {
    console.error('Delete milestone error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete milestone',
    });
  }
});

// @route   POST /api/milestones/:id/achieve
// @desc    Mark milestone as achieved
// @access  Private
router.post('/:id/achieve', authenticateToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const { id } = req.params;
    const db = getFirestore();

    // Get the milestone
    const milestoneDoc = await db.collection('milestones').doc(id).get();
    
    if (!milestoneDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Milestone not found',
      });
    }

    const milestone = milestoneDoc.data();
    
    // Verify ownership
    if (milestone.userId !== uid) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to modify this milestone',
      });
    }

    // Check if already achieved
    if (milestone.achieved) {
      return res.status(400).json({
        success: false,
        error: 'Milestone is already achieved',
      });
    }

    // Mark as achieved
    await db.collection('milestones').doc(id).update({
      achieved: true,
      achievedAt: new Date(),
      updatedAt: new Date(),
    });

    // Create achievement notification
    const notification = {
      userId: uid,
      type: 'milestone_achieved',
      title: 'Milestone Achieved! 🎉',
      message: `Congratulations! You've achieved "${milestone.title}"`,
      data: {
        milestoneId: id,
        milestoneTitle: milestone.title,
        daysRequired: milestone.daysRequired,
      },
      read: false,
      createdAt: new Date(),
    };

    await db.collection('notifications').add(notification);

    res.json({
      success: true,
      message: 'Milestone marked as achieved',
      data: {
        id,
        achieved: true,
        achievedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Achieve milestone error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark milestone as achieved',
    });
  }
});

// @route   GET /api/milestones/standard
// @desc    Get standard milestones for recovery
// @access  Private
router.get('/standard', authenticateToken, async (req, res) => {
  try {
    const standardMilestones = [
      {
        title: '24 Hours',
        description: 'One day of sobriety',
        daysRequired: 1,
        category: 'daily',
        icon: 'clock',
        color: '#FF9500',
      },
      {
        title: '1 Week',
        description: 'One week of sobriety',
        daysRequired: 7,
        category: 'weekly',
        icon: 'calendar-week',
        color: '#FF3B30',
      },
      {
        title: '30 Days',
        description: 'One month of sobriety',
        daysRequired: 30,
        category: 'monthly',
        icon: 'calendar',
        color: '#007AFF',
      },
      {
        title: '90 Days',
        description: 'Three months of sobriety',
        daysRequired: 90,
        category: 'monthly',
        icon: 'calendar-check',
        color: '#34C759',
      },
      {
        title: '6 Months',
        description: 'Six months of sobriety',
        daysRequired: 180,
        category: 'monthly',
        icon: 'calendar-star',
        color: '#AF52DE',
      },
      {
        title: '1 Year',
        description: 'One year of sobriety',
        daysRequired: 365,
        category: 'yearly',
        icon: 'trophy',
        color: '#FFD700',
      },
      {
        title: '2 Years',
        description: 'Two years of sobriety',
        daysRequired: 730,
        category: 'yearly',
        icon: 'trophy-award',
        color: '#FFD700',
      },
      {
        title: '5 Years',
        description: 'Five years of sobriety',
        daysRequired: 1825,
        category: 'yearly',
        icon: 'crown',
        color: '#FFD700',
      },
    ];

    res.json({
      success: true,
      data: standardMilestones,
      count: standardMilestones.length,
    });
  } catch (error) {
    console.error('Get standard milestones error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get standard milestones',
    });
  }
});

// @route   POST /api/milestones/bulk-create
// @desc    Create multiple standard milestones
// @access  Private
router.post('/bulk-create', [
  authenticateToken,
  body('milestoneIds').isArray({ min: 1 }),
  body('milestoneIds.*').isString(),
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
    const { milestoneIds } = req.body;
    const db = getFirestore();

    // Get standard milestones
    const standardMilestones = [
      { id: '24h', title: '24 Hours', description: 'One day of sobriety', daysRequired: 1, category: 'daily', icon: 'clock', color: '#FF9500' },
      { id: '1w', title: '1 Week', description: 'One week of sobriety', daysRequired: 7, category: 'weekly', icon: 'calendar-week', color: '#FF3B30' },
      { id: '30d', title: '30 Days', description: 'One month of sobriety', daysRequired: 30, category: 'monthly', icon: 'calendar', color: '#007AFF' },
      { id: '90d', title: '90 Days', description: 'Three months of sobriety', daysRequired: 90, category: 'monthly', icon: 'calendar-check', color: '#34C759' },
      { id: '6m', title: '6 Months', description: 'Six months of sobriety', daysRequired: 180, category: 'monthly', icon: 'calendar-star', color: '#AF52DE' },
      { id: '1y', title: '1 Year', description: 'One year of sobriety', daysRequired: 365, category: 'yearly', icon: 'trophy', color: '#FFD700' },
      { id: '2y', title: '2 Years', description: 'Two years of sobriety', daysRequired: 730, category: 'yearly', icon: 'trophy-award', color: '#FFD700' },
      { id: '5y', title: '5 Years', description: 'Five years of sobriety', daysRequired: 1825, category: 'yearly', icon: 'crown', color: '#FFD700' },
    ];

    // Filter requested milestones
    const selectedMilestones = standardMilestones.filter(m => milestoneIds.includes(m.id));

    // Check for existing milestones
    const existingMilestones = await db
      .collection('milestones')
      .where('userId', '==', uid)
      .get();

    const existingTitles = existingMilestones.docs.map(doc => doc.data().title);
    const newMilestones = selectedMilestones.filter(m => !existingTitles.includes(m.title));

    // Create new milestones
    const batch = db.batch();
    const createdMilestones = [];

    newMilestones.forEach(milestone => {
      const docRef = db.collection('milestones').doc();
      const milestoneData = {
        userId: uid,
        title: milestone.title,
        description: milestone.description,
        daysRequired: milestone.daysRequired,
        category: milestone.category,
        icon: milestone.icon,
        color: milestone.color,
        achieved: false,
        achievedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      batch.set(docRef, milestoneData);
      createdMilestones.push({
        id: docRef.id,
        ...milestoneData,
      });
    });

    await batch.commit();

    res.status(201).json({
      success: true,
      message: `${createdMilestones.length} milestones created successfully`,
      data: createdMilestones,
      count: createdMilestones.length,
    });
  } catch (error) {
    console.error('Bulk create milestones error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create milestones',
    });
  }
});

module.exports = router;
