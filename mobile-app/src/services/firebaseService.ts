// Firebase Service for Firestore Operations
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { FIRESTORE_COLLECTIONS } from '../config/firebase';
import { User, UserProfile } from '../types';

class FirebaseService {
  private db = firestore();
  private auth = auth();

  /**
   * Get current user ID
   */
  private getCurrentUserId(): string | null {
    const user = this.auth.currentUser;
    return user?.uid || null;
  }

  /**
   * Create or update user profile in Firestore
   */
  async updateUserProfile(profileData: Partial<UserProfile>): Promise<void> {
    try {
      const userId = this.getCurrentUserId();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      console.log('🔥 Firebase: Updating user profile for:', userId);
      console.log('📦 Profile data:', profileData);

      // Get the users collection reference
      const userRef = this.db.collection(FIRESTORE_COLLECTIONS.users).doc(userId);

      // Always use set() with merge: true to handle both create and update cases
      await userRef.set({
        profile: profileData,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

      console.log('✅ Firebase: User profile updated successfully');
    } catch (error) {
      console.error('❌ Firebase: Failed to update user profile:', error);
      throw error;
    }
  }

  /**
   * Get user profile from Firestore
   */
  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const userId = this.getCurrentUserId();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      console.log('🔥 Firebase: Fetching user profile for:', userId);

      const userDoc = await this.db
        .collection(FIRESTORE_COLLECTIONS.users)
        .doc(userId)
        .get();

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('📦 Firebase: Retrieved user data:', userData);
        return userData?.profile || null;
      } else {
        console.log('📭 Firebase: No user document found, creating new one');
        return null;
      }
    } catch (error) {
      console.error('❌ Firebase: Failed to get user profile:', error);
      throw error;
    }
  }

  /**
   * Create new user profile in Firestore
   */
  async createUserProfile(userProfile: UserProfile): Promise<void> {
    try {
      const userId = this.getCurrentUserId();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      console.log('🔥 Firebase: Creating new user profile for:', userId);
      console.log('📦 Profile data:', userProfile);

      // Get the users collection reference
      const userRef = this.db.collection(FIRESTORE_COLLECTIONS.users).doc(userId);

      // Create the user document
      await userRef.set({
        profile: userProfile,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      console.log('✅ Firebase: User profile created successfully');
    } catch (error) {
      console.error('❌ Firebase: Failed to create user profile:', error);
      throw error;
    }
  }

  /**
   * Update specific profile fields
   */
  async updateProfileField(field: keyof UserProfile, value: any): Promise<void> {
    try {
      const userId = this.getCurrentUserId();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      console.log(`🔥 Firebase: Updating profile field '${field}' for user:`, userId);
      console.log('📦 Field value:', value);

      const userRef = this.db.collection(FIRESTORE_COLLECTIONS.users).doc(userId);

      // Use set() with merge: true to handle both create and update cases
      await userRef.set({
        [`profile.${field}`]: value,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

      console.log(`✅ Firebase: Profile field '${field}' updated successfully`);
    } catch (error) {
      console.error(`❌ Firebase: Failed to update profile field '${field}':`, error);
      throw error;
    }
  }

  /**
   * Update sobriety date specifically
   */
  async updateSobrietyDate(sobrietyDate: string): Promise<void> {
    try {
      console.log('🔥 Firebase: Updating sobriety date to:', sobrietyDate);
      
      const userId = this.getCurrentUserId();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const userRef = this.db.collection(FIRESTORE_COLLECTIONS.users).doc(userId);
      
      // Always use set() with merge: true to handle both create and update cases
      await userRef.set({
        profile: {
          sobrietyDate: sobrietyDate,
          recoveryType: 'Other',
          fellowship: 'Other',
          anonymousId: '',
          firstName: '',
          lastInitial: '',
          avatar: null,
          bio: ''
        },
        updatedAt: firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
      
      console.log('✅ Firebase: Sobriety date updated/created successfully');
    } catch (error) {
      console.error('❌ Firebase: Failed to update sobriety date:', error);
      throw error;
    }
  }

  /**
   * Sync local user data with Firestore
   */
  async syncUserWithFirestore(localUser: User): Promise<void> {
    try {
      const userId = this.getCurrentUserId();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      console.log('🔄 Firebase: Syncing local user data with Firestore for:', userId);

      const userRef = this.db.collection(FIRESTORE_COLLECTIONS.users).doc(userId);

      // Check if user document exists
      const userDoc = await userRef.get();

      if (userDoc.exists()) {
        // Update existing document
        await userRef.update({
          profile: localUser.profile,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
        console.log('✅ Firebase: User profile synced (updated)');
      } else {
        // Create new document
        await userRef.set({
          profile: localUser.profile,
          createdAt: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
        console.log('✅ Firebase: User profile synced (created)');
      }
    } catch (error) {
      console.error('❌ Firebase: Failed to sync user with Firestore:', error);
      throw error;
    }
  }

  /**
   * Listen to user profile changes in real-time
   */
  subscribeToUserProfile(callback: (profile: UserProfile | null) => void): () => void {
    try {
      const userId = this.getCurrentUserId();
      if (!userId) {
        console.warn('⚠️ Firebase: Cannot subscribe to profile - user not authenticated');
        return () => {};
      }

      console.log('👂 Firebase: Subscribing to user profile changes for:', userId);

      const unsubscribe = this.db
        .collection(FIRESTORE_COLLECTIONS.users)
        .doc(userId)
        .onSnapshot(
          (doc) => {
            if (doc.exists()) {
              const userData = doc.data();
              const profile = userData?.profile || null;
              console.log('📡 Firebase: Profile update received:', profile);
              callback(profile);
            } else {
              console.log('📭 Firebase: User document not found');
              callback(null);
            }
          },
          (error) => {
            console.error('❌ Firebase: Profile subscription error:', error);
            callback(null);
          }
        );

      return unsubscribe;
    } catch (error) {
      console.error('❌ Firebase: Failed to subscribe to user profile:', error);
      return () => {};
    }
  }

  /**
   * Delete user profile (for account deletion)
   */
  async deleteUserProfile(): Promise<void> {
    try {
      const userId = this.getCurrentUserId();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      console.log('🗑️ Firebase: Deleting user profile for:', userId);

      await this.db
        .collection(FIRESTORE_COLLECTIONS.users)
        .doc(userId)
        .delete();

      console.log('✅ Firebase: User profile deleted successfully');
    } catch (error) {
      console.error('❌ Firebase: Failed to delete user profile:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const firebaseService = new FirebaseService();
export default firebaseService;

