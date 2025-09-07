const admin = require('firebase-admin');

let firebaseApp = null;

const initializeFirebaseAdmin = () => {
  try {
    // Check if Firebase is already initialized
    if (firebaseApp) {
      console.log('Firebase Admin already initialized');
      return firebaseApp;
    }

    // Check if Firebase is already initialized globally
    try {
      firebaseApp = admin.app();
      console.log('✅ Firebase Admin already initialized globally');
      return firebaseApp;
    } catch (error) {
      // Firebase not initialized yet, initialize it
      firebaseApp = admin.initializeApp();
      console.log('✅ Firebase Admin initialized for Functions environment');
      return firebaseApp;
    }
  } catch (error) {
    console.error('❌ Firebase Admin initialization failed:', error);
    return null;
  }
};

// Initialize Firebase Admin
initializeFirebaseAdmin();

// Get Firebase services
const getAuth = () => {
  if (!firebaseApp) {
    throw new Error('Firebase Admin not initialized');
  }
  return admin.auth();
};

const getFirestore = () => {
  if (!firebaseApp) {
    throw new Error('Firebase Admin not initialized');
  }
  return admin.firestore();
};

const verifyIdToken = async (idToken) => {
  if (!firebaseApp) {
    throw new Error('Firebase Admin not initialized');
  }
  return admin.auth().verifyIdToken(idToken);
};

const getUserByUid = async (uid) => {
  if (!firebaseApp) {
    throw new Error('Firebase Admin not initialized');
  }
  return admin.auth().getUser(uid);
};

const updateUserProfile = async (uid, userData) => {
  if (!firebaseApp) {
    throw new Error('Firebase Admin not initialized');
  }
  return admin.auth().updateUser(uid, userData);
};

const deleteUser = async (uid) => {
  if (!firebaseApp) {
    throw new Error('Firebase Admin not initialized');
  }
  return admin.auth().deleteUser(uid);
};

module.exports = {
  getAuth,
  getFirestore,
  verifyIdToken,
  getUserByUid,
  updateUserProfile,
  deleteUser,
  initializeFirebaseAdmin,
};
