// Firebase Authentication Service
import auth, { 
  FirebaseAuthTypes,
  User as FirebaseUser 
} from '@react-native-firebase/auth';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut
} from '@react-native-firebase/auth';
import { User, UserProfile, PrivacySettings } from '../types';
import { secureStorage } from './storage';
import { STORAGE_KEYS } from '../constants';

class AuthService {
  private currentUser: FirebaseUser | null = null;

  /**
   * Initialize auth service
   */
  constructor() {
    this.setupAuthStateListener();
  }

  /**
   * Setup authentication state listener
   */
  private setupAuthStateListener(): void {
    auth().onAuthStateChanged((user: FirebaseUser | null) => {
      this.currentUser = user;
      console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
    });
  }

  /**
   * Get current Firebase user
   */
  getCurrentUser(): FirebaseUser | null {
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
      const userCredential = await signInWithEmailAndPassword(
        auth(),
        email,
        password
      );

      const user = userCredential.user;
      
      // Get user data from secure storage or Firestore
      const userDataString = await secureStorage.getItem(STORAGE_KEYS.USER_DATA);
      
      if (userDataString) {
        return JSON.parse(userDataString);
      } else {
        // Fetch user data from Firestore if not in storage
        // This would be implemented with Firestore service
        throw new Error('User data not found');
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(this.getAuthErrorMessage(error.code));
    }
  }

  /**
   * Sign out user
   */
  async signOut(): Promise<void> {
    try {
      await signOut(auth());
      
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
}

// Export singleton instance
export const authService = new AuthService();

export default authService;
