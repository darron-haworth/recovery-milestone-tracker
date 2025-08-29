
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { BORDER_RADIUS, COLORS, SPACING, TYPOGRAPHY } from '../../constants';
import { RECOVERY_TYPES } from '../../recoveryTypes';
import { auth, firestore } from '../../services/firebase';
import { firebaseService } from '../../services/firebaseService';
import { AppDispatch, RootState, store } from '../../store';
import { signOut, updateUserProfile } from '../../store/slices/authSlice';
import { RecoveryType } from '../../types';

const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth);
  const { user } = authState || {};
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [tempSobrietyDate, setTempSobrietyDate] = useState<Date | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isRecoveryTypePickerVisible, setIsRecoveryTypePickerVisible] = useState(false);

  // Load profile data from Firebase when component mounts
  useEffect(() => {
    const loadProfileFromFirebase = async () => {
      if (authState?.isAuthenticated && authState?.user?.uid) {
        try {
          setIsLoadingProfile(true);
          console.log('🔄 Loading profile from Firebase for user:', authState.user.uid);
          
          const profile = await firebaseService.getUserProfile();
          if (profile) {
            console.log('📦 Profile loaded from Firebase:', profile);
            // Update Redux state with the loaded profile
            dispatch(updateUserProfile({ profile }));
          } else {
            console.log('📭 No profile found in Firebase, user may be new');
          }
        } catch (error) {
          console.error('❌ Failed to load profile from Firebase:', error);
        } finally {
          setIsLoadingProfile(false);
        }
      }
    };

    loadProfileFromFirebase();
  }, [authState?.isAuthenticated, authState?.user?.uid, dispatch]);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(signOut());
            } catch (error: any) {
              Alert.alert('Error', 'Failed to logout: ' + error.message);
            }
          },
        },
      ]
    );
  };



  const handleSobrietyDatePress = () => {
    if (user?.profile?.sobrietyDate) {
      setTempSobrietyDate(new Date(user.profile.sobrietyDate));
    } else {
      setTempSobrietyDate(new Date());
    }
    setIsDatePickerVisible(true);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    console.log('🔍 DateTimePicker onChange:', { event, selectedDate, platform: Platform.OS });
    
    if (Platform.OS === 'android') {
      // On Android, the picker automatically closes, so we need to handle the selection immediately
      if (selectedDate) {
        console.log('📱 Android: Date selected, auto-confirming:', selectedDate);
        setTempSobrietyDate(selectedDate);
        // Automatically confirm the date on Android
        handleDateConfirm(selectedDate);
      }
      setIsDatePickerVisible(false);
    } else {
      // On iOS, just update the temp date
      if (selectedDate) {
        console.log('🍎 iOS: Date selected, updating temp:', selectedDate);
        setTempSobrietyDate(selectedDate);
      }
    }
  };

  const handleDateConfirm = (selectedDate?: Date) => {
    console.log('🔍 handleDateConfirm called:', { selectedDate, tempSobrietyDate });
    console.log('👤 Current auth state:', authState);
    console.log('🔑 User authenticated:', authState?.isAuthenticated);
    console.log('👤 User object:', user);
    
    const dateToUse = selectedDate || tempSobrietyDate;
    if (dateToUse) {
      const newSobrietyDate = dateToUse.toISOString();
      console.log('📅 Processing sobriety date update:', { dateToUse, newSobrietyDate });
      
      // Calculate sobriety duration
      const today = new Date();
      const sobrietyDate = new Date(newSobrietyDate);
      const diffTime = Math.abs(today.getTime() - sobrietyDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      Alert.alert(
        'Update Sobriety Date',
        `Are you sure you want to set your sobriety date to ${dateToUse.toLocaleDateString()}?\n\nThis will show ${diffDays} days of sobriety.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Update',
            onPress: async () => {
              try {
                console.log('🚀 Updating sobriety date...');
                
                // Update local Redux state
                const actionPayload = {
                  profile: { 
                    sobrietyDate: newSobrietyDate,
                    recoveryType: user?.profile?.recoveryType || 'Other',
                    fellowship: user?.profile?.fellowship || 'Other',
                    anonymousId: user?.profile?.anonymousId || '',
                    firstName: user?.profile?.firstName || '',
                    lastInitial: user?.profile?.lastInitial || '',
                    avatar: user?.profile?.avatar,
                    bio: user?.profile?.bio || ''
                  }
                };
                console.log('📦 Redux action payload:', actionPayload);
                
                const result = await dispatch(updateUserProfile(actionPayload));
                console.log('✅ Redux updateUserProfile result:', result);
                
                // Force a delay to ensure Redux state is updated
                await new Promise<void>(resolve => setTimeout(resolve, 100));
                
                // Check the current state after update
                const currentState = store.getState();
                console.log('🔍 State after update:', currentState.auth?.user?.profile);
                
                // Also persist to Firebase
                console.log('🔥 Persisting to Firebase...');
                console.log('👤 Current user state:', user);
                console.log('🔑 User ID:', user?.uid);
                console.log('📧 User email:', user?.email);
                console.log('🔧 Firebase service available:', !!firebaseService);
                
                // Check Firebase Auth state
                try {
                  const currentUser = auth().currentUser;
                  console.log('🔥 Firebase Auth current user:', currentUser);
                  console.log('🔑 Firebase Auth UID:', currentUser?.uid);
                  console.log('🔑 Firebase Auth email:', currentUser?.email);
                  console.log('🔑 Firebase Auth emailVerified:', currentUser?.emailVerified);
                  
                  if (!currentUser) {
                    throw new Error('No Firebase user authenticated');
                  }
                  
                  // Check if user document exists in Firestore
                  const userDocRef = firestore().collection('users').doc(currentUser.uid);
                  const userDoc = await userDocRef.get();
                  console.log('📄 Firestore user document exists:', userDoc.exists);
                  console.log('📄 Firestore user document data:', userDoc.data());
                  
                } catch (firebaseCheckError) {
                  console.error('❌ Firebase check failed:', firebaseCheckError);
                  throw firebaseCheckError;
                }
                
                try {
                  console.log('🚀 Calling firebaseService.updateSobrietyDate...');
                  await firebaseService.updateSobrietyDate(newSobrietyDate);
                  console.log('✅ Firebase update successful');
                } catch (firebaseError: any) {
                  console.error('❌ Firebase update failed:', firebaseError);
                  console.error('❌ Error details:', {
                    message: firebaseError?.message,
                    code: firebaseError?.code,
                    stack: firebaseError?.stack
                  });
                  Alert.alert('Warning', 'Data saved locally but failed to sync with cloud. Error: ' + (firebaseError?.message || 'Unknown error'));
                }
                
                Alert.alert('Success', 'Sobriety date updated successfully and saved to cloud!');
              } catch (error: any) {
                console.error('❌ Sobriety date update error:', error);
                Alert.alert('Error', 'Failed to update sobriety date: ' + error.message);
              }
            },
          },
        ]
      );
    }
    setIsDatePickerVisible(false);
  };

  const handleDateCancel = () => {
    setIsDatePickerVisible(false);
    setTempSobrietyDate(null);
  };

  const handleRecoveryTypePress = () => {
    setIsRecoveryTypePickerVisible(true);
  };

  const handleRecoveryTypeSelect = async (selectedType: RecoveryType) => {
    try {
      console.log('🚀 Updating recovery type...');
      
      // Update local Redux state
      const actionPayload = {
        profile: { 
          recoveryType: selectedType,
          sobrietyDate: user?.profile?.sobrietyDate || '',
          fellowship: user?.profile?.fellowship || 'Other',
          anonymousId: user?.profile?.anonymousId || '',
          firstName: user?.profile?.firstName || '',
          lastInitial: user?.profile?.lastInitial || '',
          avatar: user?.profile?.avatar,
          bio: user?.profile?.bio || ''
        }
      };
      
      await dispatch(updateUserProfile(actionPayload));
      
      // Also persist to Firebase
      try {
        await firebaseService.updateUserProfile({ recoveryType: selectedType });
        console.log('✅ Firebase update successful');
        Alert.alert('Success', 'Recovery type updated successfully and saved to cloud!');
      } catch (firebaseError: any) {
        console.error('❌ Firebase update failed:', firebaseError);
        Alert.alert('Warning', 'Data saved locally but failed to sync with cloud. Error: ' + (firebaseError?.message || 'Unknown error'));
      }
      
    } catch (error: any) {
      console.error('❌ Recovery type update error:', error);
      Alert.alert('Error', 'Failed to update recovery type: ' + error.message);
    }
    
    setIsRecoveryTypePickerVisible(false);
  };

  const formatSobrietyDuration = (sobrietyDate: string) => {
    const today = new Date();
    const sobriety = new Date(sobrietyDate);
    const diffTime = Math.abs(today.getTime() - sobriety.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return '1 day';
    } else if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingDays = diffDays % 365;
      if (remainingDays === 0) {
        return `${years} year${years > 1 ? 's' : ''}`;
      } else {
        return `${years} year${years > 1 ? 's' : ''} and ${remainingDays} days`;
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Loading indicator */}
      {isLoadingProfile && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile from cloud...</Text>
        </View>
      )}
      
      {user && (
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {user.profile.firstName} {user.profile.lastInitial}
          </Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <TouchableOpacity 
            style={styles.recoveryTypeContainer} 
            onPress={handleRecoveryTypePress}
          >
            <View style={styles.recoveryTypeContent}>
              <Text style={styles.recoveryTypeLabel}>Recovery:</Text>
              <TouchableOpacity 
                style={styles.recoveryTypeButton}
                onPress={handleRecoveryTypePress}
              >
                                                  <Text style={styles.recoveryTypeButtonText}>
                  {user.profile.recoveryType.replace(/_/g, ' ')}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.sobrietyDateContainer} 
            onPress={handleSobrietyDatePress}
          >
            <View style={styles.sobrietyDateContent}>
              <Text style={styles.sobrietyDateLabel}>Sobriety Date:</Text>
              <TouchableOpacity 
                style={styles.sobrietyDateButton}
                onPress={handleSobrietyDatePress}
              >
                <Text style={styles.sobrietyDateButtonText}>
                  {user.profile.sobrietyDate 
                    ? new Date(user.profile.sobrietyDate).toLocaleDateString()
                    : 'Set Date'
                  }
                </Text>
              </TouchableOpacity>
            </View>
            {user.profile.sobrietyDate && (
              <View style={styles.sobrietyDurationContainer}>
                <Text style={styles.sobrietyDuration}>
                  {formatSobrietyDuration(user.profile.sobrietyDate)} sober
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      {/* Date Picker Modal */}
      {Platform.OS === 'android' ? (
        // On Android, show the date picker directly without a modal
        isDatePickerVisible && (
          <DateTimePicker
            value={tempSobrietyDate || new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
            textColor={COLORS.textPrimary}
          />
        )
      ) : (
        // On iOS, show the modal with spinner
        <Modal
          visible={isDatePickerVisible}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Set Sobriety Date</Text>
              <DateTimePicker
                value={tempSobrietyDate || new Date()}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                maximumDate={new Date()}
                textColor={COLORS.textPrimary}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButton} onPress={handleDateCancel}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={() => handleDateConfirm()}>
                  <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Recovery Type Picker Modal */}
      <Modal
        visible={isRecoveryTypePickerVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Recovery Type</Text>
            <View style={styles.recoveryTypeList}>
              {Object.entries(RECOVERY_TYPES).map(([type, info]) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.recoveryTypeOption,
                    user?.profile?.recoveryType === type && styles.recoveryTypeOptionSelected
                  ]}
                  onPress={() => handleRecoveryTypeSelect(type as RecoveryType)}
                >
                  <Text style={[
                    styles.recoveryTypeOptionText,
                    user?.profile?.recoveryType === type && styles.recoveryTypeOptionTextSelected
                  ]}>
                    {type.replace(/_/g, ' ')}
                  </Text>
                  <Text style={styles.recoveryTypeOptionDescription}>
                    {info.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={() => setIsRecoveryTypePickerVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  loadingContainer: {
    backgroundColor: COLORS.info,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  userInfo: {
    backgroundColor: COLORS.card,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xl,
  },
  userName: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  userEmail: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  recoveryTypeContainer: {
    marginBottom: SPACING.sm,
  },
  recoveryTypeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  recoveryTypeLabel: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    marginRight: SPACING.sm,
  },
  recoveryTypeButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.sm,
  },
  recoveryTypeButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
  },
  sobrietyDateContainer: {
    marginTop: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sobrietyDateContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  sobrietyDateLabel: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    marginRight: SPACING.sm,
  },
  sobrietyDateButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.sm,
  },
  sobrietyDateButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
  },
  sobrietyDurationContainer: {
    marginTop: SPACING.xs,
  },
  sobrietyDuration: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    marginTop: 'auto',
  },
  logoutButtonText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: SPACING.md,
  },
  modalButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  modalButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
  },
  modalButtonTextPrimary: {
    color: COLORS.primary,
  },
  recoveryTypeList: {
    width: '100%',
    marginBottom: SPACING.md,
  },
  recoveryTypeOption: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.xs,
    backgroundColor: COLORS.grayLight,
  },
  recoveryTypeOptionSelected: {
    backgroundColor: COLORS.primary,
  },
  recoveryTypeOptionText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  recoveryTypeOptionTextSelected: {
    color: COLORS.white,
  },
  recoveryTypeOptionDescription: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
  },
});

export default ProfileScreen;
