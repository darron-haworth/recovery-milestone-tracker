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
  // Add missing required fields
  databaseURL: FIREBASE_CONFIG.services.databaseURL,
};

// Initialize Firebase if not already initialized
if (!firebase.apps.length) {
  try {
    console.log('🔥 Initializing Firebase app...');
    console.log('📱 Config:', JSON.stringify(firebaseConfig, null, 2));
    console.log('🌍 Project ID:', firebaseConfig.projectId);
    console.log('🔑 API Key:', firebaseConfig.apiKey ? 'Present' : 'Missing');
    
    const app = firebase.initializeApp(firebaseConfig);
    console.log('✅ Firebase app initialized successfully');
    
    // Test Firebase connection
    try {
      const auth = firebase.auth();
      console.log('✅ Firebase Auth available:', !!auth);
    } catch (authError) {
      console.error('❌ Firebase Auth test failed:', authError);
    }
    
  } catch (error) {
    console.error('❌ Firebase app initialization failed:', error);
    // Try to get existing app
    try {
      const existingApp = firebase.app();
      console.log('✅ Using existing Firebase app');
    } catch (existingError) {
      console.error('❌ No existing Firebase app found:', existingError);
    }
  }
}

// Simple Firebase initialization function
const initializeFirebase = () => {
  try {
    const app = firebase.app();
    console.log('🚀 Firebase is ready!');
    console.log('✅ Firebase App:', !!app);
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
