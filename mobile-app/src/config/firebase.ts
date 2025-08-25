// Firebase Configuration for Recovery Milestone Tracker
// This configuration is extracted from google-services.json and GoogleService-Info.plist

export const FIREBASE_CONFIG = {
  // Project Information
  projectId: 'recovery-milestone-tracker',
  projectNumber: '677302029618',
  
  // Android Configuration
  android: {
    packageName: 'com.mustflywithme.recovery_milestone_tracker',
    googleServicesFile: 'google-services.json',
    apiKey: 'YOUR_API_KEY_HERE',
    appId: '1:677302029618:android:6cf1aaf684d27cccd49b2b',
  },
  
  // iOS Configuration
  ios: {
    bundleId: 'org.reactjs.native.example.RecoveryMilestoneTracker',
    googleServicesFile: 'GoogleService-Info.plist',
    apiKey: 'YOUR_API_KEY_HERE',
    appId: '1:677302029618:ios:d800cea79d8cbb20d49b2b',
  },
  
  // Firebase Services
  services: {
    // Firestore (enabled by default) - Better than Realtime Database
    firestoreSettings: {
      projectId: 'recovery-milestone-tracker',
      // Firestore doesn't need a database URL
    },
    
    // Cloud Storage
    storageBucket: 'recovery-milestone-tracker.firebasestorage.app',
    
    // Realtime Database URL
    databaseURL: 'https://recovery-milestone-tracker-default-rtdb.firebaseio.com',
    
    // Cloud Firestore (default)
    firestoreSettings: {
      projectId: 'recovery-milestone-tracker',
    },
    
    // Authentication
    auth: {
      signInOptions: ['email', 'password'],
      enableAnonymousAuth: false,
    },
    
    // Cloud Messaging
    messaging: {
      autoInitEnabled: true,
      notificationChannelId: 'recovery_milestones',
      notificationChannelName: 'Recovery Milestones',
      notificationChannelDescription: 'Notifications for recovery milestones and achievements',
    },
    
    // Analytics
    analytics: {
      enabled: false, // Disabled by default for privacy
    },
  },
  
  // Development vs Production
  environment: __DEV__ ? 'development' : 'production',
  
  // API Endpoints
  apiEndpoints: {
    development: 'http://localhost:3000',
    production: 'https://recovery-milestone-tracker-default-rtdb.firebaseio.com',
  },
  
  // Feature Flags
  features: {
    pushNotifications: true,
    emailNotifications: false,
    analytics: false,
    crashlytics: false,
    performance: false,
  },
};

// Firebase Service URLs
export const FIREBASE_URLS = {
  database: FIREBASE_CONFIG.services.databaseURL,
  storage: `https://${FIREBASE_CONFIG.services.storageBucket}`,
  firestore: `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}`,
  auth: `https://identitytoolkit.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}`,
  functions: `https://us-central1-${FIREBASE_CONFIG.projectId}.cloudfunctions.net`,
};

// Firebase Collection Names
export const FIRESTORE_COLLECTIONS = {
  users: 'users',
  friendships: 'friendships',
  milestones: 'milestones',
  notifications: 'notifications',
  recoveryGroups: 'recovery_groups',
  supportMessages: 'support_messages',
  appSettings: 'app_settings',
};

// Firebase Storage Paths
export const STORAGE_PATHS = {
  userAvatars: 'users/avatars',
  milestoneImages: 'milestones/images',
  groupImages: 'groups/images',
  supportAttachments: 'support/attachments',
};

// Firebase Security Rules (for reference)
export const SECURITY_RULES = {
  users: {
    read: 'request.auth != null && (request.auth.uid == resource.data.userId || resource.data.privacySettings.profileVisibility == "public")',
    write: 'request.auth != null && request.auth.uid == resource.data.userId',
  },
  friendships: {
    read: 'request.auth != null && (request.auth.uid == resource.data.userId || request.auth.uid == resource.data.friendId)',
    write: 'request.auth != null && (request.auth.uid == resource.data.userId || request.auth.uid == resource.data.friendId)',
  },
  milestones: {
    read: 'request.auth != null && (request.auth.uid == resource.data.userId || resource.data.privacySettings.milestoneVisibility == "public")',
    write: 'request.auth != null && request.auth.uid == resource.data.userId',
  },
  notifications: {
    read: 'request.auth != null && request.auth.uid == resource.data.userId',
    write: 'request.auth != null && request.auth.uid == resource.data.userId',
  },
};

// Export default config
export default FIREBASE_CONFIG;
