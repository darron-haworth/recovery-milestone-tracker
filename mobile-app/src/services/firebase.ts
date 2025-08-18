// Firebase Configuration Service
import { initializeApp, FirebaseApp } from '@react-native-firebase/app';
import { FIREBASE_CONFIG } from '../../shared/constants';

class FirebaseService {
  private app: FirebaseApp | null = null;
  private isInitialized = false;

  /**
   * Initialize Firebase with configuration
   */
  initialize(): FirebaseApp {
    if (this.isInitialized && this.app) {
      return this.app;
    }

    try {
      // Check if Firebase is already initialized
      if (this.app) {
        this.isInitialized = true;
        return this.app;
      }

      // Initialize Firebase with configuration
      this.app = initializeApp(FIREBASE_CONFIG);
      this.isInitialized = true;

      console.log('Firebase initialized successfully');
      return this.app;
    } catch (error) {
      console.error('Firebase initialization failed:', error);
      throw new Error('Failed to initialize Firebase');
    }
  }

  /**
   * Get Firebase app instance
   */
  getApp(): FirebaseApp {
    if (!this.app || !this.isInitialized) {
      return this.initialize();
    }
    return this.app;
  }

  /**
   * Check if Firebase is initialized
   */
  isFirebaseInitialized(): boolean {
    return this.isInitialized && this.app !== null;
  }

  /**
   * Get Firebase configuration
   */
  getConfig() {
    return FIREBASE_CONFIG;
  }

  /**
   * Enable Firebase Analytics (if enabled in features)
   */
  enableAnalytics(): void {
    if (process.env.NODE_ENV === 'production') {
      // Only enable analytics in production if explicitly enabled
      console.log('Firebase Analytics enabled');
    }
  }

  /**
   * Disable Firebase Analytics
   */
  disableAnalytics(): void {
    console.log('Firebase Analytics disabled');
  }
}

// Export singleton instance
export const firebaseService = new FirebaseService();

// Initialize Firebase on import
firebaseService.initialize();

export default firebaseService;
