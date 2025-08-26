import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants';
import { signOut, updateUserProfile } from '../../store/slices/authSlice';
import DateTimePicker from '@react-native-community/datetimepicker';

const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth);
  const { user } = authState || {};
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [tempSobrietyDate, setTempSobrietyDate] = useState<Date | null>(null);

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
              Alert.alert('Success', 'Logged out successfully');
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
                await dispatch(updateUserProfile({
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
                }));
                Alert.alert('Success', 'Sobriety date updated successfully!');
              } catch (error: any) {
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
      <Text style={styles.title}>Profile</Text>
      
      {user && (
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {user.profile.firstName} {user.profile.lastInitial}
          </Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.userRecovery}>
            Recovery: {user.profile.recoveryType}
          </Text>
          
          <TouchableOpacity 
            style={styles.sobrietyDateContainer} 
            onPress={handleSobrietyDatePress}
          >
            <Text style={styles.sobrietyDateLabel}>Sobriety Date:</Text>
            <Text style={styles.sobrietyDateValue}>
              {user.profile.sobrietyDate 
                ? new Date(user.profile.sobrietyDate).toLocaleDateString()
                : 'Not set'
              }
            </Text>
            {user.profile.sobrietyDate && (
              <Text style={styles.sobrietyDuration}>
                {formatSobrietyDuration(user.profile.sobrietyDate)} sober
              </Text>
            )}
            <Text style={styles.editHint}>Tap to edit</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      {/* Date Picker Modal */}
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
              display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
              onChange={handleDateChange}
              maximumDate={new Date()}
              textColor={COLORS.textPrimary}
            />
            {Platform.OS === 'ios' && (
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButton} onPress={handleDateCancel}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={handleDateConfirm}>
                  <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>Confirm</Text>
                </TouchableOpacity>
              </View>
            )}
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
  userRecovery: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  sobrietyDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sobrietyDateLabel: {
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.textSecondary,
    marginRight: SPACING.sm,
  },
  sobrietyDateValue: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textPrimary,
  },
  sobrietyDuration: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  editHint: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
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
});

export default ProfileScreen;
