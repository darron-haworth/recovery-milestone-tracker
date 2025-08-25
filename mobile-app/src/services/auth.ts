// Firebase Authentication Service
import { User, UserProfile, PrivacySettings } from '../types';
import { secureStorage } from './storage';
import { STORAGE_KEYS } from '../constants';

// Lazy load Firebase auth to avoid initialization errors
let auth: any = null;
let createUserWithEmailAndPassword: any = null;
let signInWithEmailAndPassword: any = null;
let sendPasswordResetEmail: any = null;
let updateProfile: any = null;
let signOut: any = null;

// Initialize Firebase auth when needed
const initializeFirebaseAuth = () => {
  if (!auth) {
    try {
      const firebaseAuth = require('@react-native-firebase/auth');
      auth = firebaseAuth.default;
      createUserWithEmailAndPassword = firebaseAuth.createUserWithEmailAndPassword;
      signInWithEmailAndPassword = firebaseAuth.signInWithEmailAndPassword;
      sendPasswordResetEmail = firebaseAuth.sendPasswordResetEmail;
      updateProfile = firebaseAuth.updateProfile;
      signOut = firebaseAuth.signOut;
      console.log('✅ Firebase Auth initialized in auth service');
    } catch (error) {
      console.error('❌ Failed to initialize Firebase Auth:', error);
    }
  }
};

class AuthService {
  private currentUser: any = null;
  private _isInitialized: boolean = false;

  /**
   * Initialize auth service
   */
  constructor() {
    // Don't setup auth listener in constructor - wait for Firebase to be ready
  }

  /**
   * Initialize the auth service when Firebase is ready
   */
  initialize(): void {
    if (this._isInitialized) return;
    
    try {
      console.log('🚀 Initializing auth service...');
      
      initializeFirebaseAuth();
      console.log('🔑 Firebase auth module loaded:', !!auth);
      
      if (auth) {
        this.setupAuthStateListener();
        this._isInitialized = true;
        console.log('✅ Auth service initialized');
        
        // Test Firebase auth connection
        try {
          const currentUser = auth().currentUser;
          console.log('👤 Current Firebase user:', currentUser ? 'Logged in' : 'Not logged in');
        } catch (authTestError) {
          console.error('❌ Firebase auth test failed:', authTestError);
        }
      } else {
        console.error('❌ Firebase auth not available');
      }
    } catch (error) {
      console.error('❌ Auth service initialization failed:', error);
    }
  }

  /**
   * Check if auth service is initialized
   */
  get isInitialized(): boolean {
    return this._isInitialized;
  }

  /**
   * Setup authentication state listener
   */
  private setupAuthStateListener(): void {
    if (!auth) return;
    
    auth().onAuthStateChanged((user: any) => {
      this.currentUser = user;
      console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
    });
  }

  /**
   * Get current Firebase user
   */
  getCurrentUser(): any {
    if (!auth) return null;
    return this.currentUser || auth().currentUser;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  /**
   * Sign up with email and password
   */
  async signUp(
    email: string, 
    password: string, 
    profile: Partial<UserProfile>
  ): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth(),
        email,
        password
      );

      const user = userCredential.user;

      // Update user profile
      if (user) {
        await updateProfile(user, {
          displayName: profile.firstName || 'Anonymous',
          photoURL: profile.avatar
        });
      }

      // Create user document in Firestore
      const userData: User = {
        uid: user.uid,
        email: user.email || email,
        profile: {
          recoveryType: profile.recoveryType || 'Other',
          sobrietyDate: profile.sobrietyDate || new Date().toISOString(),
          fellowship: profile.fellowship || 'Other',
          anonymousId: this.generateAnonymousId(),
          firstName: profile.firstName,
          lastInitial: profile.lastInitial,
          avatar: profile.avatar,
          bio: profile.bio
        },
        privacy: {
          isAnonymous: profile.firstName ? false : true,
          shareMilestones: true,
          allowFriendRequests: true,
          showInDirectory: false,
          notificationSettings: {
            milestoneReminders: true,
            friendRequests: true,
            encouragementMessages: true,
            dailyMotivation: true,
            pushEnabled: true,
            emailEnabled: true
          }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Store user data securely
      await secureStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));

      return userData;
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<User> {
    try {
      console.log('🔐 Attempting sign in for:', email);
      console.log('🔑 Auth service initialized:', this._isInitialized);
      console.log('🔥 Firebase auth available:', !!auth);
      
      if (!this._isInitialized) {
        console.log('⚠️ Auth service not initialized, initializing now...');
        this.initialize();
      }
      
      if (!auth) {
        throw new Error('Firebase Auth not available');
      }
      
      console.log('🚀 Calling Firebase signInWithEmailAndPassword...');
      const userCredential = await signInWithEmailAndPassword(
        auth(),
        email,
        password
      );
      
      console.log('✅ Firebase sign in successful:', userCredential.user.uid);
      const user = userCredential.user;
      
      // Get user data from secure storage or Firestore
      const userDataString = await secureStorage.getItem(STORAGE_KEYS.USER_DATA);
      
      if (userDataString) {
        console.log('📱 User data found in storage');
        return JSON.parse(userDataString);
      } else {
        console.log('⚠️ User data not found in storage, creating default profile');
        // Create default user profile
        const defaultUser: User = {
          uid: user.uid,
          email: user.email || email,
          profile: {
            recoveryType: 'Other',
            sobrietyDate: new Date().toISOString(),
            fellowship: 'Other',
            anonymousId: this.generateAnonymousId(),
            firstName: user.displayName || 'User',
            lastInitial: 'U',
            avatar: user.photoURL,
            bio: 'Welcome to Recovery Milestone Tracker!'
          },
          privacy: {
            isAnonymous: false,
            shareMilestones: true,
            allowFriendRequests: true,
            showInDirectory: false,
            notificationSettings: {
              milestoneReminders: true,
              friendRequests: true,
              encouragementMessages: true,
              dailyMotivation: true,
              pushEnabled: true,
              emailEnabled: true
            }
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Store user data
        await secureStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(defaultUser));
        console.log('✅ Default user profile created and stored');
        return defaultUser;
      }
    } catch (error: any) {
      console.error('❌ Sign in error:', error);
      console.error('❌ Error code:', error.code);
      console.error('❌ Error message:', error.message);
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  /**
   * Sign out user
   */
  async signOut(): Promise<void> {
    try {
      if (auth) {
        await signOut(auth());
      }
      
      // Clear secure storage
      await secureStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await secureStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      await secureStorage.removeItem(STORAGE_KEYS.USER_DATA);
      
      this.currentUser = null;
      console.log('User signed out successfully');
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error('Failed to sign out');
    }
  }

  /**
   * Clear all stored user data (for testing/debugging)
   */
  async clearStoredData(): Promise<void> {
    try {
      await secureStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await secureStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      await secureStorage.removeItem(STORAGE_KEYS.USER_DATA);
      this.currentUser = null;
      console.log('All stored user data cleared');
    } catch (error: any) {
      console.error('Clear stored data error:', error);
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth(), email);
      console.log('Password reset email sent');
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<UserProfile>): Promise<void> {
    try {
      const user = this.getCurrentUser();
      if (!user) {
        throw new Error('No authenticated user');
      }

      // Update Firebase profile
      await updateProfile(user, {
        displayName: updates.firstName || user.displayName,
        photoURL: updates.avatar || user.photoURL
      });

      // Update local user data
      const userDataString = await secureStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (userDataString) {
        const userData: User = JSON.parse(userDataString);
        userData.profile = { ...userData.profile, ...updates };
        userData.updatedAt = new Date().toISOString();
        
        await secureStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      }

      console.log('Profile updated successfully');
    } catch (error: any) {
      console.error('Profile update error:', error);
      throw new Error('Failed to update profile');
    }
  }

  /**
   * Update privacy settings
   */
  async updatePrivacySettings(privacy: Partial<PrivacySettings>): Promise<void> {
    try {
      const userDataString = await secureStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (userDataString) {
        const userData: User = JSON.parse(userDataString);
        userData.privacy = { ...userData.privacy, ...privacy };
        userData.updatedAt = new Date().toISOString();
        
        await secureStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      }

      console.log('Privacy settings updated successfully');
    } catch (error: any) {
      console.error('Privacy settings update error:', error);
      throw new Error('Failed to update privacy settings');
    }
  }

  /**
   * Delete user account
   */
  async deleteAccount(): Promise<void> {
    try {
      const user = this.getCurrentUser();
      if (!user) {
        throw new Error('No authenticated user');
      }

      // Delete user data from Firestore first
      // This would be implemented with Firestore service

      // Delete Firebase user
      await user.delete();

      // Clear secure storage
      await secureStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      await secureStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      await secureStorage.removeItem(STORAGE_KEYS.USER_DATA);

      this.currentUser = null;
      console.log('Account deleted successfully');
    } catch (error: any) {
      console.error('Account deletion error:', error);
      throw new Error('Failed to delete account');
    }
  }

  /**
   * Get user data from secure storage
   */
  async getUserData(): Promise<User | null> {
    try {
      const userDataString = await secureStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userDataString ? JSON.parse(userDataString) : null;
    } catch (error) {
      console.error('Get user data error:', error);
      return null;
    }
  }

  /**
   * Generate anonymous ID for privacy
   */
  private generateAnonymousId(): string {
    return 'anon_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Get user-friendly error messages
   */
  private getAuthErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      'auth/email-already-in-use': 'An account with this email already exists',
      'auth/invalid-email': 'Please enter a valid email address',
      'auth/operation-not-allowed': 'Email/password accounts are not enabled',
      'auth/weak-password': 'Password should be at least 6 characters',
      'auth/user-disabled': 'This account has been disabled',
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later',
      'auth/network-request-failed': 'Network error. Please check your connection',
      'auth/invalid-credential': 'Invalid email or password',
      'auth/account-exists-with-different-credential': 'An account already exists with the same email address but different sign-in credentials'
    };

    return errorMessages[errorCode] || 'Authentication failed. Please try again.';
  }

  /**
   * Check if user needs to re-authenticate
   */
  async needsReauthentication(): Promise<boolean> {
    try {
      const user = this.getCurrentUser();
      if (!user) return false;

      // Check if user needs re-authentication for sensitive operations
      const lastSignInTime = user.metadata.lastSignInTime;
      const reauthThreshold = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

      if (lastSignInTime) {
        const lastSignIn = new Date(lastSignInTime).getTime();
        const now = new Date().getTime();
        return (now - lastSignIn) > reauthThreshold;
      }

      return false;
    } catch (error) {
      console.error('Reauthentication check error:', error);
      return false;
    }
  }

  /**
   * Get test credentials for development
   */
  getTestCredentials() {
    return {}; // Removed hardcoded test credentials
  }

  /**
   * Create test user account (for development only)
   */
  async createTestUser(userKey: string): Promise<User> {
    throw new Error('Test user creation has been removed. Please create users directly in Firebase.');
  }
}

// Export singleton instance
export const authService = new AuthService();

export default authService;
