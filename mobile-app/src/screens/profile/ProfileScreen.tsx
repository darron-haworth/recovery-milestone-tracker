
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
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
  const [isNameEditorVisible, setIsNameEditorVisible] = useState(false);
  const [tempFirstName, setTempFirstName] = useState('');
  const [tempLastInitial, setTempLastInitial] = useState('');
  const [isNicknameEditorVisible, setIsNicknameEditorVisible] = useState(false);
  const [tempNickname, setTempNickname] = useState('');

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
            console.log('👤 First Name:', profile.firstName);
            console.log('👤 Last Initial:', profile.lastInitial);
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

  const handleNamePress = () => {
    setTempFirstName(user?.profile?.firstName || '');
    setTempLastInitial(user?.profile?.lastInitial || '');
    setIsNameEditorVisible(true);
  };

  const handleNameSave = async () => {
    if (!tempFirstName.trim() || !tempLastInitial.trim()) {
      Alert.alert('Error', 'Please enter both first name and last initial');
      return;
    }

    try {
      console.log('🚀 Updating name...');
      
      // Update local Redux state
      const actionPayload = {
        profile: { 
          firstName: tempFirstName.trim(),
          lastInitial: tempLastInitial.trim().toUpperCase(),
          recoveryType: user?.profile?.recoveryType || 'Other',
          sobrietyDate: user?.profile?.sobrietyDate || '',
          fellowship: user?.profile?.fellowship || 'Other',
          anonymousId: user?.profile?.anonymousId || '',
          avatar: user?.profile?.avatar,
          bio: user?.profile?.bio || ''
        }
      };
      
      await dispatch(updateUserProfile(actionPayload));
      
      // Also persist to Firebase
      try {
        await firebaseService.updateUserProfile({ 
          firstName: tempFirstName.trim(),
          lastInitial: tempLastInitial.trim().toUpperCase()
        });
        console.log('✅ Firebase update successful');
        Alert.alert('Success', 'Name updated successfully and saved to cloud!');
      } catch (firebaseError: any) {
        console.error('❌ Firebase update failed:', firebaseError);
        Alert.alert('Warning', 'Data saved locally but failed to sync with cloud. Error: ' + (firebaseError?.message || 'Unknown error'));
      }
      
    } catch (error: any) {
      console.error('❌ Name update error:', error);
      Alert.alert('Error', 'Failed to update name: ' + error.message);
    }
    
    setIsNameEditorVisible(false);
  };

  const handleNameCancel = () => {
    setIsNameEditorVisible(false);
    setTempFirstName('');
    setTempLastInitial('');
  };

  const handleNicknamePress = () => {
    setTempNickname(user?.profile?.nickname || '');
    setIsNicknameEditorVisible(true);
  };

  const handleNicknameSave = async () => {
    if (!tempNickname.trim()) {
      Alert.alert('Error', 'Please enter a nickname');
      return;
    }

    try {
      console.log('🚀 Updating nickname...');
      
      // Update local Redux state
      const actionPayload = {
        profile: { 
          nickname: tempNickname.trim(),
          firstName: user?.profile?.firstName || '',
          lastInitial: user?.profile?.lastInitial || '',
          recoveryType: user?.profile?.recoveryType || 'Other',
          sobrietyDate: user?.profile?.sobrietyDate || '',
          fellowship: user?.profile?.fellowship || 'Other',
          anonymousId: user?.profile?.anonymousId || '',
          avatar: user?.profile?.avatar,
          bio: user?.profile?.bio || ''
        }
      };
      
      await dispatch(updateUserProfile(actionPayload));
      
      // Also persist to Firebase
      try {
        await firebaseService.updateUserProfile({ 
          nickname: tempNickname.trim()
        });
        console.log('✅ Firebase update successful');
        Alert.alert('Success', 'Nickname updated successfully and saved to cloud!');
      } catch (firebaseError: any) {
        console.error('❌ Firebase update failed:', firebaseError);
        Alert.alert('Warning', 'Data saved locally but failed to sync with cloud. Error: ' + (firebaseError?.message || 'Unknown error'));
      }
      
    } catch (error: any) {
      console.error('❌ Nickname update error:', error);
      Alert.alert('Error', 'Failed to update nickname: ' + error.message);
    }
    
    setIsNicknameEditorVisible(false);
  };

  const handleNicknameCancel = () => {
    setIsNicknameEditorVisible(false);
    setTempNickname('');
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

          
          <TouchableOpacity 
            style={styles.userNameContainer} 
            onPress={handleNamePress}
          >
            <View style={styles.userNameContent}>
              <Text style={styles.userNameLabel}>Name:</Text>
              <TouchableOpacity 
                style={styles.userNameButton}
                onPress={handleNamePress}
              >
                <Text style={styles.userNameButtonText}>
                  {user.profile.firstName && user.profile.lastInitial 
                    ? `${user.profile.firstName} ${user.profile.lastInitial}`
                    : 'Tap to set name'
                  }
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.nicknameContainer} 
            onPress={handleNicknamePress}
          >
            <View style={styles.nicknameContent}>
              <Text style={styles.nicknameLabel}>Nickname:</Text>
              <TouchableOpacity 
                style={styles.nicknameButton}
                onPress={handleNicknamePress}
              >
                <Text style={styles.nicknameButtonText}>
                  {user.profile.nickname || 'Tap to set nickname'}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.nicknameHint}>
              Used when sharing with friends for anonymity
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.recoveryTypeContainer} 
            onPress={handleRecoveryTypePress}
          >
            <View style={styles.recoveryTypeContent}>
              <Text style={styles.recoveryTypeLabel}>Recovery Type:</Text>
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
        <Text style={styles.logoutEmailText}>{user.email}</Text>
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

      {/* Name Editor Modal */}
      <Modal
        visible={isNameEditorVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Name</Text>
            
            <View style={styles.nameInputContainer}>
              <Text style={styles.nameInputLabel}>First Name:</Text>
              <TextInput
                style={styles.nameInput}
                value={tempFirstName}
                onChangeText={setTempFirstName}
                placeholder="Enter first name"
                autoFocus={true}
              />
            </View>
            
            <View style={styles.nameInputContainer}>
              <Text style={styles.nameInputLabel}>Last Initial:</Text>
              <TextInput
                style={styles.nameInput}
                value={tempLastInitial}
                onChangeText={setTempLastInitial}
                placeholder="Enter last initial"
                maxLength={1}
              />
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleNameCancel}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleNameSave}>
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Nickname Editor Modal */}
      <Modal
        visible={isNicknameEditorVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Nickname</Text>
            <Text style={styles.modalSubtitle}>
              This nickname will be used when sharing your sobriety details with friends for anonymity
            </Text>
            
            <View style={styles.nameInputContainer}>
              <Text style={styles.nameInputLabel}>Nickname:</Text>
              <TextInput
                style={styles.nameInput}
                value={tempNickname}
                onChangeText={setTempNickname}
                placeholder="Enter your nickname"
                autoFocus={true}
                maxLength={20}
              />
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleNicknameCancel}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleNicknameSave}>
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Save</Text>
              </TouchableOpacity>
            </View>
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
  emailContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    width: '100%',
  },
  emailLabel: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.white,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  userNameContainer: {
    marginBottom: SPACING.sm,
  },
  userNameContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  userNameLabel: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    marginRight: SPACING.sm,
  },
  userNameButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.sm,
  },
  userNameButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
  },
  userEmail: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.white,
    marginBottom: SPACING.sm,
    textAlign: 'center',
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
    marginBottom: SPACING.xs,
  },
  logoutEmailText: {
    color: COLORS.white,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
    textAlign: 'center',
    opacity: 0.8,
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
  modalSubtitle: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.lineHeight.normal,
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
  nameInputContainer: {
    width: '100%',
    marginBottom: SPACING.md,
  },
  nameInputLabel: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  nameInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.white,
  },
  nicknameContainer: {
    marginBottom: SPACING.sm,
  },
  nicknameContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  nicknameLabel: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    marginRight: SPACING.sm,
  },
  nicknameButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.sm,
  },
  nicknameButtonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
  },
  nicknameHint: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: SPACING.xs,
  },
});

export default ProfileScreen;
