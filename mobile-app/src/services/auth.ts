// Authentication Service
import auth from '@react-native-firebase/auth';
import { STORAGE_KEYS } from '../constants';
import { PrivacySettings, User, UserProfile } from '../types';
import { API_ENDPOINTS, apiService } from './api';
import { secureStorage } from './storage';

// Hybrid authentication service - Firebase client SDK for local dev, backend API for production

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
   * Initialize the auth service
   */
  initialize(): void {
    if (this._isInitialized) return;
    
    try {
      console.log('🚀 Initializing backend auth service...');
      
      this._isInitialized = true;
      console.log('✅ Backend auth service initialized');
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

  // No auth state listener needed for backend authentication

  /**
   * Get current user from stored data
   */
  async getCurrentUser(): Promise<any> {
    try {
      // Get user data from secure storage
      const userDataString = await secureStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (userDataString) {
        return JSON.parse(userDataString);
      }
      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  }

  /**
   * Sign up with email and password via backend API
   */
  async signUp(
    email: string, 
    password: string, 
    profile: Partial<UserProfile>
  ): Promise<User> {
    try {
      // Import API service
      const { apiService, API_ENDPOINTS } = await import('./api');
      
      // Call backend signup endpoint with profile data
      const signupData = {
        email,
        password,
        displayName: profile.firstName || 'Anonymous',
        profile: {
          firstName: profile.firstName,
          lastInitial: profile.lastInitial,
          nickname: profile.nickname,
          recoveryType: profile.recoveryType,
          sobrietyDate: profile.sobrietyDate
        }
      };
      console.log('📤 Sending signup data:', signupData);
      const response = await apiService.post(API_ENDPOINTS.AUTH.SIGNUP, signupData);

      if (!response.success) {
        throw new Error(response.error || 'Signup failed');
      }

      // Create user data object from backend response (which includes Firestore data)
      const userData: User = {
        uid: (response.data as any).uid,
        email: (response.data as any).email,
        profile: {
          recoveryType: (response.data as any).profile?.recoveryType || profile.recoveryType || 'Other',
          sobrietyDate: (response.data as any).profile?.sobrietyDate || profile.sobrietyDate || new Date().toISOString(),
          program: (response.data as any).profile?.program || profile.program || 'Other',
          anonymousId: (response.data as any).profile?.anonymousId || this.generateAnonymousId(),
          firstName: (response.data as any).profile?.firstName || profile.firstName,
          lastInitial: (response.data as any).profile?.lastInitial || profile.lastInitial,
          avatar: (response.data as any).profile?.avatar || profile.avatar,
          bio: (response.data as any).profile?.bio || profile.bio
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
        createdAt: (response.data as any).createdAt || new Date().toISOString(),
        updatedAt: (response.data as any).updatedAt || new Date().toISOString()
      };

      // Store user data securely
      await secureStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));

      return userData;
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(error.message || 'Signup failed');
    }
  }

  /**
   * Sign in with email and password via backend API
   */
  async signIn(email: string, password: string): Promise<User> {
    try {
      console.log('🔐 Attempting sign in for:', email);
      
      // Use Firebase Client SDK to authenticate
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const firebaseUser = userCredential.user;
      
      if (!firebaseUser) {
        throw new Error('No user returned from Firebase');
      }

      // Get the ID token
      const idToken = await firebaseUser.getIdToken();
      
      // Import API service
      const { apiService, API_ENDPOINTS } = await import('./api');
      
      // Send ID token to backend for verification and get API token
      const response = await apiService.post(API_ENDPOINTS.AUTH.LOGIN, {
        idToken: idToken
      });

      if (!response.success) {
        throw new Error(response.error || 'Login failed');
      }

      // Store the API token for future API calls
      if ((response.data as any).apiToken) {
        await secureStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, (response.data as any).apiToken);
      }
      
      // Create user profile from backend response (which includes Firestore data)
      const userData: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        profile: {
          recoveryType: (response.data as any).profile?.recoveryType || 'Other',
          sobrietyDate: (response.data as any).profile?.sobrietyDate || new Date().toISOString(),
          program: (response.data as any).profile?.program || 'Other',
          anonymousId: (response.data as any).profile?.anonymousId || this.generateAnonymousId(),
          firstName: (response.data as any).profile?.firstName || (response.data as any).displayName || 'User',
          lastInitial: (response.data as any).profile?.lastInitial || 'U',
          avatar: (response.data as any).profile?.avatar || undefined,
          bio: (response.data as any).profile?.bio || 'Welcome to Recovery Milestone Tracker!'
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
        createdAt: (response.data as any).createdAt || new Date().toISOString(),
        updatedAt: (response.data as any).updatedAt || new Date().toISOString()
      };
      
      // Store user data
      await secureStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      console.log('📱 User profile loaded from backend and stored');
      return userData;
    } catch (error: any) {
      console.error('❌ Sign in error:', error);
      throw new Error(error.message || 'Login failed');
    }
  }

  /**
   * Sign out user
   */
  async signOut(): Promise<void> {
    try {
      console.log('🚪 Starting sign out process...');
      
      // Since we're using backend authentication, we don't need to call Firebase client SDK
      // Just clear the stored authentication data
      
      // Clear secure storage
      console.log('🗑️ Clearing AUTH_TOKEN...');
      await secureStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      
      console.log('🗑️ Clearing REFRESH_TOKEN...');
      await secureStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      
      console.log('🗑️ Clearing USER_DATA...');
      await secureStorage.removeItem(STORAGE_KEYS.USER_DATA);
      
      this.currentUser = null;
    } catch (error: any) {
      console.error('❌ Sign out error:', error);
      throw new Error('Failed to sign out: ' + error.message);
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
   * Send password reset email via backend API
   */
  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      // Import API service
      const { apiService, API_ENDPOINTS } = await import('./api');
      
      // Call backend forgot password endpoint
      const response = await apiService.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
        email
      });

      if (!response.success) {
        throw new Error(response.error || 'Password reset failed');
      }

      console.log('Password reset email sent via backend');
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw new Error(error.message || 'Password reset failed');
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<UserProfile>): Promise<void> {
    try {
      const user = await this.getCurrentUser();
      if (!user) {
        throw new Error('No authenticated user');
      }

      // Update profile via backend API
      const response = await apiService.put(API_ENDPOINTS.USER.UPDATE_PROFILE, {
        profile: updates
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to update profile');
      }

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
      const user = await this.getCurrentUser();
      if (!user) {
        throw new Error('No authenticated user');
      }

      // Delete account via backend API
      const response = await apiService.delete(API_ENDPOINTS.AUTH.DELETE_ACCOUNT);

      if (!response.success) {
        throw new Error(response.error || 'Failed to delete account');
      }

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
   * Refresh user profile data from backend
   */
  async refreshProfile(): Promise<User> {
    try {
      const { apiService, API_ENDPOINTS } = await import('./api');
      
      // Get current user data
      const response = await apiService.get(API_ENDPOINTS.AUTH.ME);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch profile');
      }

        // Update local user data with backend data
        const userData: User = {
          uid: (response.data as any).uid,
          email: (response.data as any).email,
          profile: {
            recoveryType: (response.data as any).profile?.recoveryType || 'Other',
            sobrietyDate: (response.data as any).profile?.sobrietyDate || new Date().toISOString(),
            program: (response.data as any).profile?.program || 'Other',
            anonymousId: (response.data as any).profile?.anonymousId || this.generateAnonymousId(),
            firstName: (response.data as any).profile?.firstName || (response.data as any).displayName || 'User',
            lastInitial: (response.data as any).profile?.lastInitial || 'U',
            avatar: (response.data as any).profile?.avatar || undefined,
            bio: (response.data as any).profile?.bio || 'Welcome to Recovery Milestone Tracker!'
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
          createdAt: (response.data as any).createdAt || new Date().toISOString(),
          updatedAt: (response.data as any).updatedAt || new Date().toISOString()
        };
      
      // Store updated user data
      await secureStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      console.log('📱 Profile refreshed from backend');
      return userData;
    } catch (error: any) {
      console.error('Profile refresh error:', error);
      throw new Error('Failed to refresh profile: ' + error.message);
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
      const user = await this.getCurrentUser();
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
