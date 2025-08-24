import { FIREBASE_CONFIG, FIREBASE_URLS, FIRESTORE_COLLECTIONS } from '../config/firebase';

// Firebase Service Initialization
class FirebaseService {
  private static instance: FirebaseService;
  private isInitialized: boolean = false;

  private constructor() {}

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  // Initialize Firebase services
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('Firebase already initialized');
      return;
    }

    try {
      console.log('🔥 Initializing Firebase services...');
      console.log(`📱 Project: ${FIREBASE_CONFIG.projectId}`);
      console.log(`🌍 Environment: ${FIREBASE_CONFIG.environment}`);
      console.log(`🗄️ Database: ${FIREBASE_CONFIG.services.databaseURL}`);
      console.log(`📦 Storage: ${FIREBASE_CONFIG.services.storageBucket}`);

      // Firebase services will be initialized by the native modules
      // This service provides configuration and utility methods
      
      this.isInitialized = true;
      console.log('✅ Firebase services initialized successfully');
    } catch (error) {
      console.error('❌ Firebase initialization failed:', error);
      throw error;
    }
  }

  // Get Firebase configuration
  getConfig() {
    return FIREBASE_CONFIG;
  }

  // Get Firebase URLs
  getUrls() {
    return FIREBASE_URLS;
  }

  // Get Firestore collection names
  getCollections() {
    return FIRESTORE_COLLECTIONS;
  }

  // Check if Firebase is initialized
  isFirebaseInitialized(): boolean {
    return this.isInitialized;
  }

  // Get current environment
  getEnvironment(): string {
    return FIREBASE_CONFIG.environment;
  }

  // Check if feature is enabled
  isFeatureEnabled(feature: keyof typeof FIREBASE_CONFIG.features): boolean {
    return FIREBASE_CONFIG.features[feature];
  }

  // Get API endpoint for current environment
  getApiEndpoint(): string {
    const env = FIREBASE_CONFIG.environment as keyof typeof FIREBASE_CONFIG.apiEndpoints;
    return FIREBASE_CONFIG.apiEndpoints[env];
  }

  // Validate Firebase configuration
  validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!FIREBASE_CONFIG.projectId) {
      errors.push('Project ID is missing');
    }

    if (!FIREBASE_CONFIG.services.databaseURL) {
      errors.push('Database URL is missing');
    }

    if (!FIREBASE_CONFIG.services.storageBucket) {
      errors.push('Storage bucket is missing');
    }

    if (!FIREBASE_CONFIG.android.apiKey || !FIREBASE_CONFIG.ios.apiKey) {
      errors.push('API keys are missing');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Get Firebase project info
  getProjectInfo() {
    return {
      projectId: FIREBASE_CONFIG.projectId,
      projectNumber: FIREBASE_CONFIG.projectNumber,
      environment: FIREBASE_CONFIG.environment,
      version: '1.0.0',
    };
  }

  // Get service status
  getServiceStatus() {
    return {
      firebase: this.isInitialized,
      auth: true, // Always available
      firestore: true, // Always available
      storage: true, // Always available
      messaging: FIREBASE_CONFIG.features.pushNotifications,
      analytics: FIREBASE_CONFIG.features.analytics,
    };
  }
}

// Export singleton instance
export const firebaseService = FirebaseService.getInstance();

// Export configuration constants
export { FIREBASE_CONFIG, FIREBASE_URLS, FIRESTORE_COLLECTIONS };

// Export default service
export default firebaseService;
