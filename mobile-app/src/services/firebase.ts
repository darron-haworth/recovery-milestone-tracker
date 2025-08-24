import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import analytics from '@react-native-firebase/analytics';
import { FIREBASE_CONFIG } from '../config/firebase';

// Firebase App Configuration
const firebaseConfig = {
  apiKey: FIREBASE_CONFIG.android.apiKey,
  authDomain: `${FIREBASE_CONFIG.projectId}.firebaseapp.com`,
  projectId: FIREBASE_CONFIG.projectId,
  storageBucket: FIREBASE_CONFIG.services.storageBucket,
  messagingSenderId: FIREBASE_CONFIG.projectNumber,
  appId: FIREBASE_CONFIG.android.appId,
};

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
  try {
    console.log('🔥 Initializing Firebase app...');
    firebase.initializeApp(firebaseConfig);
    console.log('✅ Firebase app initialized successfully');
  } catch (error) {
    console.error('❌ Firebase app initialization failed:', error);
  }
}

// Simple Firebase initialization function
const initializeFirebase = () => {
  try {
    console.log('🚀 Firebase is ready!');
    console.log('✅ Firebase Auth:', !!auth);
    console.log('✅ Firebase Firestore:', !!firestore);
    console.log('✅ Firebase Messaging:', !!messaging);
    console.log('✅ Firebase Analytics:', !!analytics);
    return true;
  } catch (error) {
    console.error('❌ Firebase initialization check failed:', error);
    return false;
  }
};

// Export Firebase instances
export { firebase, auth, firestore, messaging, analytics };

// Export configuration
export { FIREBASE_CONFIG };

// Export initialization function
export { initializeFirebase };

// Export default Firebase app
export default firebase.app();
