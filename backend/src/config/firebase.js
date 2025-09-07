const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

let firebaseApp = null;

const initializeFirebaseAdmin = () => {
  try {
    // Check if Firebase is already initialized
    if (firebaseApp) {
      console.log('Firebase Admin already initialized');
      return firebaseApp;
    }

    // Check for Google Application Credentials environment variable
    const googleCredentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 
      path.join(__dirname, '../../firebase-admin-key.json');

    let credentialPath = null;

    // Priority: 1. GOOGLE_APPLICATION_CREDENTIALS env var, 2. FIREBASE_SERVICE_ACCOUNT_PATH env var, 3. local file
    if (googleCredentialsPath && fs.existsSync(googleCredentialsPath)) {
      credentialPath = googleCredentialsPath;
      console.log('✅ Using Google Application Credentials from environment variable');
    } else if (fs.existsSync(serviceAccountPath)) {
      credentialPath = serviceAccountPath;
      console.log('✅ Using Firebase service account from local file');
    } else {
      console.warn('⚠️  Firebase Admin SDK service account file not found');
      console.warn('   Expected locations:');
      console.warn(`   1. GOOGLE_APPLICATION_CREDENTIALS env var: ${googleCredentialsPath || 'not set'}`);
      console.warn(`   2. FIREBASE_SERVICE_ACCOUNT_PATH env var: ${process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 'not set'}`);
      console.warn(`   3. Local file: ${serviceAccountPath}`);
      console.warn('   Trying Application Default Credentials...');
      
      // Try Firebase CLI token first, then Application Default Credentials
      try {
        if (process.env.FIREBASE_TOKEN) {
          // Use Firebase CLI token
          firebaseApp = admin.initializeApp({
            projectId: 'recovery-milestone-tracker',
            credential: admin.credential.refreshToken(process.env.FIREBASE_TOKEN),
          });
          console.log('✅ Firebase Admin initialized with Firebase CLI token');
          return firebaseApp;
        } else {
          // Try Application Default Credentials
          firebaseApp = admin.initializeApp({
            projectId: 'recovery-milestone-tracker',
          });
          console.log('✅ Firebase Admin initialized with Application Default Credentials');
          return firebaseApp;
        }
      } catch (error) {
        console.error('❌ Failed to initialize Firebase Admin:', error.message);
        
        // In development, we can continue without Firebase
        if (process.env.NODE_ENV === 'development') {
          console.log('🚀 Starting server in development mode without Firebase');
          return null;
        } else {
          throw new Error('Firebase Admin SDK service account file is required in production');
        }
      }
    }

    // Initialize Firebase Admin
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(credentialPath),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });

    console.log('✅ Firebase Admin initialized successfully');
    return firebaseApp;
  } catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error);
    
    // In development, we can continue without Firebase
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 Starting server in development mode without Firebase');
      return null;
    } else {
      throw error;
    }
  }
};

const getFirebaseAdmin = () => {
  if (!firebaseApp) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error('Firebase Admin not initialized. Firebase features are disabled in development mode.');
    } else {
      throw new Error('Firebase Admin not initialized. Call initializeFirebaseAdmin() first.');
    }
  }
  return firebaseApp;
};

const getAuth = () => {
  if (!firebaseApp) {
    throw new Error('Firebase Auth not available. Firebase Admin not initialized.');
  }
  return getFirebaseAdmin().auth();
};

const getFirestore = () => {
  if (!firebaseApp) {
    throw new Error('Firestore not available. Firebase Admin not initialized.');
  }
  return getFirebaseAdmin().firestore();
};

const getStorage = () => {
  if (!firebaseApp) {
    throw new Error('Firebase Storage not available. Firebase Admin not initialized.');
  }
  return getFirebaseAdmin().storage();
};

const getMessaging = () => {
  if (!firebaseApp) {
    throw new Error('Firebase Messaging not available. Firebase Admin not initialized.');
  }
  return getFirebaseAdmin().messaging();
};

// Verify Firebase ID token
const verifyIdToken = async (idToken) => {
  if (!firebaseApp) {
    throw new Error('Firebase Auth not available. Please set up Firebase Admin SDK.');
  }
  
  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Token verification failed:', error);
    throw new Error('Invalid token');
  }
};

// Create custom token
const createCustomToken = async (uid, additionalClaims = {}) => {
  if (!firebaseApp) {
    throw new Error('Firebase Auth not available. Please set up Firebase Admin SDK.');
  }
  
  try {
    const customToken = await getAuth().createCustomToken(uid, additionalClaims);
    return customToken;
  } catch (error) {
    console.error('Custom token creation failed:', error);
    throw new Error('Failed to create custom token');
  }
};

// Get user by UID
const getUserByUid = async (uid) => {
  if (!firebaseApp) {
    throw new Error('Firebase Auth not available. Please set up Firebase Admin SDK.');
  }
  
  try {
    const userRecord = await getAuth().getUser(uid);
    return userRecord;
  } catch (error) {
    console.error('Get user failed:', error);
    throw new Error('User not found');
  }
};

// Update user profile
const updateUserProfile = async (uid, profileData) => {
  if (!firebaseApp) {
    throw new Error('Firebase Auth not available. Please set up Firebase Admin SDK.');
  }
  
  try {
    const userRecord = await getAuth().updateUser(uid, profileData);
    return userRecord;
  } catch (error) {
    console.error('Update user profile failed:', error);
    throw new Error('Failed to update user profile');
  }
};

// Delete user
const deleteUser = async (uid) => {
  if (!firebaseApp) {
    throw new Error('Firebase Auth not available. Please set up Firebase Admin SDK.');
  }
  
  try {
    await getAuth().deleteUser(uid);
    return true;
  } catch (error) {
    console.error('Delete user failed:', error);
    throw new Error('Failed to delete user');
  }
};

// Send push notification
const sendPushNotification = async (token, notification, data = {}) => {
  if (!firebaseApp) {
    throw new Error('Firebase Messaging not available. Please set up Firebase Admin SDK.');
  }
  
  try {
    const message = {
      token,
      notification,
      data,
      android: {
        priority: 'high',
        notification: {
          channelId: 'recovery_milestones',
          priority: 'high',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    const response = await getMessaging().send(message);
    return response;
  } catch (error) {
    console.error('Send push notification failed:', error);
    throw new Error('Failed to send push notification');
  }
};

// Send multicast notification
const sendMulticastNotification = async (tokens, notification, data = {}) => {
  if (!firebaseApp) {
    throw new Error('Firebase Messaging not available. Please set up Firebase Admin SDK.');
  }
  
  try {
    const message = {
      tokens,
      notification,
      data,
      android: {
        priority: 'high',
        notification: {
          channelId: 'recovery_milestones',
          priority: 'high',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    const response = await getMessaging().sendMulticast(message);
    return response;
  } catch (error) {
    console.error('Send multicast notification failed:', error);
    throw new Error('Failed to send multicast notification');
  }
};

module.exports = {
  initializeFirebaseAdmin,
  getFirebaseAdmin,
  getAuth,
  getFirestore,
  getStorage,
  getMessaging,
  verifyIdToken,
  createCustomToken,
  getUserByUid,
  updateUserProfile,
  deleteUser,
  sendPushNotification,
  sendMulticastNotification,
};
