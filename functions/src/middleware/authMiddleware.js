const { verifyIdToken } = require('../config/firebase-functions');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required',
      });
    }

    try {
      // Verify Firebase ID token
      const decodedToken = await verifyIdToken(token);
      
      // Add user info to request
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified,
        ...decodedToken,
      };

      next();
    } catch (tokenError) {
      // In development mode, we can provide a mock user for testing
      if (process.env.NODE_ENV === 'development' && token === 'dev-token') {
        console.log('🔧 Development mode: Using mock user for testing');
        req.user = {
          uid: 'dev-user-123',
          email: 'dev@example.com',
          emailVerified: true,
        };
        next();
      } else {
        return res.status(401).json({
          success: false,
          error: 'Invalid or expired token',
        });
      }
    }
  } catch (error) {
    console.error('Authentication middleware error:', error);
    
    // In development mode, provide helpful error message
    if (process.env.NODE_ENV === 'development') {
      return res.status(500).json({
        success: false,
        error: 'Authentication failed. Firebase Admin SDK not configured. Use "dev-token" for testing.',
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Authentication failed',
      });
    }
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      try {
        const decodedToken = await verifyIdToken(token);
        req.user = {
          uid: decodedToken.uid,
          email: decodedToken.email,
          emailVerified: decodedToken.email_verified,
          ...decodedToken,
        };
      } catch (tokenError) {
        // In development mode, allow mock token
        if (process.env.NODE_ENV === 'development' && token === 'dev-token') {
          console.log('🔧 Development mode: Using mock user for testing');
          req.user = {
            uid: 'dev-user-123',
            email: 'dev@example.com',
            emailVerified: true,
          };
        } else {
          // Token is invalid, but we continue without authentication
          console.warn('Invalid token in optional auth:', tokenError.message);
        }
      }
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next();
  }
};

const requireEmailVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
    });
  }

  if (!req.user.emailVerified) {
    return res.status(403).json({
      success: false,
      error: 'Email verification required',
    });
  }

  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
    });
  }

  // Check if user has admin role (you can customize this based on your needs)
  if (!req.user.admin && !req.user.role === 'admin') {
    return res.status(403).json({
      success: false,
      error: 'Admin access required',
    });
  }

  next();
};

const rateLimitByUser = (req, res, next) => {
  // This is a simple rate limiting by user
  // In production, you might want to use Redis or a more sophisticated solution
  const userKey = req.user?.uid || req.ip;
  
  if (!req.app.locals.rateLimit) {
    req.app.locals.rateLimit = new Map();
  }

  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100;

  const userRequests = req.app.locals.rateLimit.get(userKey) || [];
  
  // Remove old requests outside the window
  const recentRequests = userRequests.filter(time => now - time < windowMs);
  
  if (recentRequests.length >= maxRequests) {
    return res.status(429).json({
      success: false,
      error: 'Rate limit exceeded',
    });
  }

  recentRequests.push(now);
  req.app.locals.rateLimit.set(userKey, recentRequests);

  next();
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requireEmailVerification,
  requireAdmin,
  rateLimitByUser,
};
