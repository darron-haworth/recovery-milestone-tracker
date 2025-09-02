
import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { firebaseService } from '../../services/firebaseService';
import { AppDispatch, RootState } from '../../store';
import { signOut } from '../../store/slices/authSlice';
import { updateProfile } from '../../store/slices/userSlice';
import { RecoveryType } from '../../types';

const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth);
  const user = authState.user;
  const isAuthenticated = authState.isAuthenticated;

  // Modal states
  const [isNameModalVisible, setIsNameModalVisible] = useState(false);
  const [isNicknameModalVisible, setIsNicknameModalVisible] = useState(false);
  const [isRecoveryTypeModalVisible, setIsRecoveryTypeModalVisible] = useState(false);
  const [isSobrietyDateModalVisible, setIsSobrietyDateModalVisible] = useState(false);

  const [tempYear, setTempYear] = useState('');
  const [tempMonth, setTempMonth] = useState('');
  const [tempDay, setTempDay] = useState('');
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Temporary values for editing
  const [tempFirstName, setTempFirstName] = useState('');
  const [tempLastInitial, setTempLastInitial] = useState('');
  const [tempNickname, setTempNickname] = useState('');
  const [tempRecoveryType, setTempRecoveryType] = useState<RecoveryType>('Alcoholism');
  const [tempSobrietyDate, setTempSobrietyDate] = useState<Date | null>(null);

  useEffect(() => {
    const loadProfileData = async () => {
      if (user?.uid && isAuthenticated) {
        setIsLoadingProfile(true);
        try {
          // Fetch profile data from Firebase
          const profile = await firebaseService.getUserProfile();
          if (profile) {
            // Update local state
            setTempFirstName(profile.firstName || '');
            setTempLastInitial(profile.lastInitial || '');
            setTempNickname(profile.nickname || '');
            setTempRecoveryType(profile.recoveryType || 'Alcoholism');
            if (profile.sobrietyDate) {
              const date = new Date(profile.sobrietyDate);
              setTempSobrietyDate(date);
              setTempYear(date.getFullYear().toString());
              setTempMonth((date.getMonth() + 1).toString().padStart(2, '0'));
              setTempDay(date.getDate().toString().padStart(2, '0'));
            }
            
            // Also update Redux store if needed
            if (!user.profile || Object.keys(user.profile).length === 0) {
              dispatch(updateProfile(profile));
            }
          }
        } catch (error) {
          console.error('Failed to load profile from Firebase:', error);
          // Fallback to Redux store data if Firebase fails
          if (user?.profile) {
            setTempFirstName(user.profile.firstName || '');
            setTempLastInitial(user.profile.lastInitial || '');
            setTempNickname(user.profile.nickname || '');
            setTempRecoveryType(user.profile.recoveryType || 'Alcoholism');
            if (user.profile.sobrietyDate) {
              const date = new Date(user.profile.sobrietyDate);
              setTempSobrietyDate(date);
              setTempYear(date.getFullYear().toString());
              setTempMonth((date.getMonth() + 1).toString().padStart(2, '0'));
              setTempDay(date.getDate().toString().padStart(2, '0'));
            }
          }
        } finally {
          setIsLoadingProfile(false);
        }
      }
    };

    loadProfileData();
  }, [user, isAuthenticated, dispatch]);

  const calculateSobrietyTime = (startDate: Date) => {
    const now = new Date();
    
    // Get the components of both dates
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const startDay = startDate.getDate();
    
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDay = now.getDate();
    
    // Calculate years
    let years = currentYear - startYear;
    let months = currentMonth - startMonth;
    let days = currentDay - startDay;
    
    // Adjust for negative days
    if (days < 0) {
      months--;
      // Get the number of days in the previous month
      const prevMonth = new Date(currentYear, currentMonth, 0);
      days += prevMonth.getDate();
    }
    
    // Adjust for negative months
    if (months < 0) {
      years--;
      months += 12;
    }
    
    // Calculate total days for reference
    const diffTime = Math.abs(now.getTime() - startDate.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return { years, months, days, totalDays };
  };

  const handleNameSave = async () => {
    // Validate input for privacy and anonymity
    if (!tempFirstName.trim()) {
      Alert.alert('Privacy Notice', 'First name is required for identification while maintaining anonymity.');
      return;
    }
    
    if (!tempLastInitial.trim() || tempLastInitial.length !== 1) {
      Alert.alert('Privacy Notice', 'Last initial must be exactly 1 character for maximum anonymity protection.');
      return;
    }
    
    try {
      const updatedProfile = {
        firstName: tempFirstName.trim(),
        lastInitial: tempLastInitial.trim().toUpperCase(),
      };
      
      await firebaseService.updateUserProfile(updatedProfile);
      dispatch(updateProfile(updatedProfile));
      setIsNameModalVisible(false);
      Alert.alert('Success', 'Name updated successfully while maintaining your privacy!');
    } catch (error: any) {
      Alert.alert('Error', `Failed to update name: ${error.message}`);
    }
  };

  const handleNicknameSave = async () => {
    try {
      const updatedProfile = { nickname: tempNickname };
      await firebaseService.updateUserProfile(updatedProfile);
      dispatch(updateProfile(updatedProfile));
      setIsNicknameModalVisible(false);
      Alert.alert('Success', 'Nickname updated successfully!');
    } catch (error: any) {
      Alert.alert('Error', `Failed to update nickname: ${error.message}`);
    }
  };

  const handleRecoveryTypeSave = async () => {
    try {
      const updatedProfile = { recoveryType: tempRecoveryType };
      await firebaseService.updateUserProfile(updatedProfile);
      dispatch(updateProfile(updatedProfile));
      setIsRecoveryTypeModalVisible(false);
      Alert.alert('Success', 'Recovery type updated successfully!');
    } catch (error: any) {
      Alert.alert('Error', `Failed to update recovery type: ${error.message}`);
    }
  };

  const handleSobrietyDateSave = async () => {
    if (!tempYear || !tempMonth || !tempDay) {
      Alert.alert('Error', 'Please enter a valid date');
      return;
    }
    
    try {
      const year = parseInt(tempYear);
      const month = parseInt(tempMonth) - 1; // Month is 0-indexed
      const day = parseInt(tempDay);
      
      if (year < 1900 || year > new Date().getFullYear() || month < 0 || month > 11 || day < 1 || day > 31) {
        Alert.alert('Error', 'Please enter a valid date');
        return;
      }
      
      const newDate = new Date(year, month, day);
      const updatedProfile = { sobrietyDate: newDate.toISOString() };
      await firebaseService.updateUserProfile(updatedProfile);
      dispatch(updateProfile(updatedProfile));
      setTempSobrietyDate(newDate);
      setIsSobrietyDateModalVisible(false);
      Alert.alert('Success', 'Sobriety date updated successfully!');
    } catch (error: any) {
      Alert.alert('Error', `Failed to update sobriety date: ${error.message}`);
    }
  };



  const handleLogout = async () => {
    try {
      await dispatch(signOut());
    } catch (error: any) {
      Alert.alert('Error', 'Failed to logout: ' + error.message);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isLoadingProfile) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, color: '#64748b' }}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const sobrietyTime = tempSobrietyDate ? calculateSobrietyTime(tempSobrietyDate) : { years: 0, months: 0, days: 0, totalDays: 0 };
  const displayName = tempFirstName && tempLastInitial ? `${tempFirstName} ${tempLastInitial}` : 'Set Your Name';
  const initials = displayName !== 'Set Your Name' ? displayName.split(' ').map(n => n[0]).join('') : '?';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView style={{ flex: 1 }}>
        {/* Header with gradient background */}
        <LinearGradient
          colors={['#2E8B57', '#2E8B57']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingTop: 15,
            paddingBottom: 15,
            paddingHorizontal: 20,
            alignItems: 'center',
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 32,
            elevation: 8,
          }}
        >
          <View style={{ marginBottom: 5 }}>
            <View style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 3,
              borderColor: 'rgba(255, 255, 255, 0.3)',
            }}>
              <Text style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: '#ffffff',
                letterSpacing: 1,
              }}>
                {initials}
              </Text>
            </View>
          </View>
          
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: 2,
            textShadowColor: 'rgba(0, 0, 0, 0.1)',
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 4,
          }}>
            {displayName}
          </Text>
          <Text style={{
            fontSize: 13,
            color: 'rgba(255, 255, 255, 0.85)',
            fontWeight: '500',
          }}>
            @{tempNickname || 'nickname'}
          </Text>
        </LinearGradient>

        {/* Profile Content */}
        <View style={{
          padding: 12,
          paddingTop: 8,
          maxWidth: 420,
          alignSelf: 'center',
          width: '100%',
        }}>
          
          {/* Name and Nickname Cards Row */}
          <View style={{
            flexDirection: 'row',
            marginTop: 1,
            marginBottom: 6,
            gap: 8,
          }}>
            {/* Name Card */}
            <TouchableOpacity
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 12,
                padding: 10,
                flex: 1,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 20,
                elevation: 4,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.8)',
              }}
              onPress={() => setIsNameModalVisible(true)}
            >
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 6,
              }}>
                <View style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: '#f1f5f9',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 6,
                }}>
                  <Text style={{ fontSize: 14 }}>👤</Text>
                </View>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '700',
                  color: '#1e293b',
                }}>
                  Name
                </Text>
              </View>
              <Text style={{
                fontSize: 14,
                color: '#64748b',
                fontWeight: '600',
              }}>
                {displayName}
              </Text>
            </TouchableOpacity>

            {/* Nickname Card */}
            <TouchableOpacity
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 12,
                padding: 10,
                flex: 1,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 20,
                elevation: 4,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.8)',
              }}
              onPress={() => setIsNicknameModalVisible(true)}
            >
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 6,
              }}>
                <View style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: '#f1f5f9',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 6,
                }}>
                  <Text style={{ fontSize: 14 }}>🏷️</Text>
                </View>
                <Text style={{
                  fontSize: 14,
                  fontWeight: '700',
                  color: '#1e293b',
                }}>
                  Nickname
                </Text>
              </View>
              <Text style={{
                fontSize: 14,
                color: '#64748b',
                fontWeight: '600',
              }}>
                @{tempNickname || 'Set nickname'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Recovery Type Card */}
          <TouchableOpacity
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 12,
              padding: 10,
              marginBottom: 6,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 20,
              elevation: 4,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.8)',
            }}
            onPress={() => setIsRecoveryTypeModalVisible(true)}
          >
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1,
              }}>
                <View style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: '#f1f5f9',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 8,
                }}>
                  <Text style={{ fontSize: 16 }}>🎯</Text>
                </View>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: '#1e293b',
                }}>
                  Recovery Journey
                </Text>
              </View>
              <Text style={{
                fontSize: 18,
                color: '#64748b',
                fontWeight: '600',
                marginLeft: 8,
              }}>
                {tempRecoveryType.replace(/_/g, ' ')}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Sobriety Stats Card */}
          <TouchableOpacity
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 16,
              padding: 12,
              marginBottom: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 20,
              elevation: 4,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.8)',
            }}
            onPress={() => setIsSobrietyDateModalVisible(true)}
          >
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 6,
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <View style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: '#f1f5f9',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 8,
                }}>
                  <Text style={{ fontSize: 16 }}>🏆</Text>
                </View>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: '#1e293b',
                }}>
                  Sobriety Time
                </Text>
              </View>
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: '#64748b',
              }}>
                {sobrietyTime.totalDays} days total
              </Text>
            </View>
            
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginVertical: 6,
              padding: 6,
              backgroundColor: '#f8fafc',
              borderRadius: 8,
              borderWidth: 2,
              borderColor: '#e2e8f0',
            }}>
              <View style={{
                flex: 1,
                alignItems: 'center',
              }}>
                <Text style={{
                  fontSize: 32,
                  fontWeight: 'bold',
                  color: '#2E8B57',
                  lineHeight: 32,
                }}>
                  {sobrietyTime.years}
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: '#64748b',
                  marginTop: 6,
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}>
                  Years
                </Text>
              </View>
              
              <View style={{
                width: 2,
                height: 50,
                backgroundColor: '#d1d5db',
                marginHorizontal: 12,
                borderRadius: 2,
              }} />
              
              <View style={{
                flex: 1,
                alignItems: 'center',
              }}>
                <Text style={{
                  fontSize: 32,
                  fontWeight: 'bold',
                  color: '#2E8B57',
                  lineHeight: 32,
                }}>
                  {sobrietyTime.months}
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: '#64748b',
                  marginTop: 6,
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}>
                  Months
                </Text>
              </View>
              
              <View style={{
                width: 2,
                height: 50,
                backgroundColor: '#d1d5db',
                marginHorizontal: 12,
                borderRadius: 2,
              }} />
              
              <View style={{
                flex: 1,
                alignItems: 'center',
              }}>
                <Text style={{
                  fontSize: 32,
                  fontWeight: 'bold',
                  color: '#2E8B57',
                  lineHeight: 32,
                }}>
                  {sobrietyTime.days}
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: '#64748b',
                  marginTop: 6,
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}>
                  Days
                </Text>
              </View>
            </View>
            
            {tempSobrietyDate && (
              <Text style={{
                fontSize: 14,
                color: '#64748b',
                textAlign: 'center',
                fontWeight: '500',
                marginTop: 4,
              }}>
                Since {tempSobrietyDate.toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Text>
            )}
          </TouchableOpacity>

          {/* Logout Section */}
          <TouchableOpacity
            style={{
              borderRadius: 16,
              marginTop: 8,
              marginBottom: 20,
              shadowColor: '#6366f1',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
              elevation: 8,
            }}
            onPress={handleLogout}
          >
            <LinearGradient
              colors={['#2E8B57', '#2E8B57']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                borderRadius: 16,
                padding: 16,
                alignItems: 'center',
              }}
            >
              <Text style={{
                color: '#ffffff',
                fontSize: 18,
                fontWeight: '700',
                letterSpacing: 0.5,
                marginBottom: 6,
              }}>
                Logout
              </Text>
              <Text style={{
                fontSize: 15,
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: '500',
              }}>
                {user.email}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Name Edit Modal */}
      <Modal
        visible={isNameModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsNameModalVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: '#ffffff',
            borderRadius: 20,
            padding: 24,
            width: '80%',
            maxWidth: 400,
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: 8,
              textAlign: 'center',
            }}>
              Edit Name
            </Text>
            <Text style={{
              fontSize: 14,
              color: '#64748b',
              textAlign: 'center',
              marginBottom: 20,
              lineHeight: 20,
              fontStyle: 'italic',
            }}>
              For privacy and anonymity, only your first name and last initial are stored
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#e2e8f0',
                borderRadius: 12,
                padding: 16,
                fontSize: 16,
                marginBottom: 16,
                backgroundColor: '#f8fafc',
              }}
              placeholder="First Name"
              value={tempFirstName}
              onChangeText={setTempFirstName}
            />
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#e2e8f0',
                borderRadius: 12,
                padding: 16,
                fontSize: 16,
                marginBottom: 24,
                backgroundColor: '#f8fafc',
              }}
              placeholder="Last Initial (1 character only)"
              value={tempLastInitial}
              onChangeText={(text) => {
                // Ensure only 1 character maximum for privacy
                if (text.length <= 1) {
                  setTempLastInitial(text.toUpperCase());
                }
              }}
              maxLength={1}
              autoCapitalize="characters"
            />
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  padding: 16,
                  borderRadius: 12,
                  backgroundColor: '#f1f5f9',
                  marginRight: 8,
                  alignItems: 'center',
                }}
                onPress={() => setIsNameModalVisible(false)}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#64748b',
                }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  padding: 16,
                  borderRadius: 12,
                  backgroundColor: '#2E8B57',
                  marginLeft: 8,
                  alignItems: 'center',
                }}
                onPress={handleNameSave}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#ffffff',
                }}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Nickname Edit Modal */}
      <Modal
        visible={isNicknameModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsNicknameModalVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: '#ffffff',
            borderRadius: 20,
            padding: 24,
            width: '80%',
            maxWidth: 400,
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: 8,
              textAlign: 'center',
            }}>
              Edit Nickname
            </Text>
            <Text style={{
              fontSize: 14,
              color: '#64748b',
              textAlign: 'center',
              marginBottom: 20,
              lineHeight: 20,
              fontStyle: 'italic',
            }}>
              For anonymity protection, the app uses your nickname when sharing with other users
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#e2e8f0',
                borderRadius: 12,
                padding: 16,
                fontSize: 16,
                marginBottom: 24,
                backgroundColor: '#f8fafc',
              }}
              placeholder="Nickname"
              value={tempNickname}
              onChangeText={setTempNickname}
            />
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  padding: 16,
                  borderRadius: 12,
                  backgroundColor: '#f1f5f9',
                  marginRight: 8,
                  alignItems: 'center',
                }}
                onPress={() => setIsNicknameModalVisible(false)}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#64748b',
                }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  padding: 16,
                  borderRadius: 12,
                  backgroundColor: '#2E8B57',
                  marginLeft: 8,
                  alignItems: 'center',
                }}
                onPress={handleNicknameSave}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#ffffff',
                }}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Recovery Type Edit Modal */}
      <Modal
        visible={isRecoveryTypeModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsRecoveryTypeModalVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: '#ffffff',
            borderRadius: 20,
            padding: 24,
            width: '80%',
            maxWidth: 400,
            maxHeight: '80%',
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: 20,
              textAlign: 'center',
            }}>
              Select Recovery Type
            </Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {['Alcoholism', 'Drug_Addiction', 'Gambling', 'Food_Addiction', 'Other'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    backgroundColor: tempRecoveryType === type ? '#2E8B57' : '#f8fafc',
                    marginBottom: 8,
                    borderWidth: 1,
                    borderColor: tempRecoveryType === type ? '#2E8B57' : '#e2e8f0',
                  }}
                  onPress={() => setTempRecoveryType(type as RecoveryType)}
                >
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: tempRecoveryType === type ? '#ffffff' : '#1e293b',
                  }}>
                    {type.replace(/_/g, ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
            }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  padding: 16,
                  borderRadius: 12,
                  backgroundColor: '#f1f5f9',
                  marginRight: 8,
                  alignItems: 'center',
                }}
                onPress={() => setIsRecoveryTypeModalVisible(false)}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#64748b',
                }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  padding: 16,
                  borderRadius: 12,
                  backgroundColor: '#2E8B57',
                  marginLeft: 8,
                  alignItems: 'center',
                }}
                onPress={handleRecoveryTypeSave}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#ffffff',
                }}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Sobriety Date Edit Modal */}
      <Modal
        visible={isSobrietyDateModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsSobrietyDateModalVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: '#ffffff',
            borderRadius: 20,
            padding: 24,
            width: '95%',
            maxWidth: 500,
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: 20,
              textAlign: 'center',
            }}>
              Set Sobriety Date
            </Text>
            <Text style={{
              fontSize: 16,
              color: '#64748b',
              marginBottom: 20,
              textAlign: 'center',
            }}>
              {tempSobrietyDate ? `Current: ${tempSobrietyDate.toLocaleDateString()}` : 'No date set'}
            </Text>
            <View style={{ marginBottom: 20 }}>
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: '#64748b',
                marginBottom: 8,
              }}>
                Select your sobriety date:
              </Text>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: '#f8fafc',
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#e2e8f0',
                padding: 4,
                gap: 4,
              }}>
                <View style={{ flex: 1.5, minWidth: 60 }}>
                  <Text style={{
                    fontSize: 10,
                    fontWeight: '600',
                    color: '#64748b',
                    textAlign: 'center',
                    marginBottom: 2,
                  }}>
                    Month
                  </Text>
                  <Picker
                    selectedValue={tempMonth}
                    onValueChange={setTempMonth}
                    style={{
                      height: 50,
                      backgroundColor: '#ffffff',
                      borderRadius: 4,
                    }}
                    itemStyle={{
                      fontSize: 12,
                      color: '#1e293b',
                    }}
                    dropdownIconColor="#64748b"
                  >
                    <Picker.Item label="Month" value="" />
                    <Picker.Item label="Jan" value="1" />
                    <Picker.Item label="Feb" value="2" />
                    <Picker.Item label="Mar" value="3" />
                    <Picker.Item label="Apr" value="4" />
                    <Picker.Item label="May" value="5" />
                    <Picker.Item label="Jun" value="6" />
                    <Picker.Item label="Jul" value="7" />
                    <Picker.Item label="Aug" value="8" />
                    <Picker.Item label="Sep" value="9" />
                    <Picker.Item label="Oct" value="10" />
                    <Picker.Item label="Nov" value="11" />
                    <Picker.Item label="Dec" value="12" />
                  </Picker>
                </View>
                <View style={{ flex: 1, minWidth: 50 }}>
                  <Text style={{
                    fontSize: 10,
                    fontWeight: '600',
                    color: '#64748b',
                    textAlign: 'center',
                    marginBottom: 2,
                  }}>
                    Day
                  </Text>
                  <Picker
                    selectedValue={tempDay}
                    onValueChange={setTempDay}
                    style={{
                      height: 50,
                      backgroundColor: '#ffffff',
                      borderRadius: 4,
                    }}
                    itemStyle={{
                      fontSize: 12,
                      color: '#1e293b',
                    }}
                    dropdownIconColor="#64748b"
                  >
                    <Picker.Item label="Day" value="" />
                    {Array.from({ length: 31 }, (_, i) => (
                      <Picker.Item key={i + 1} label={`${i + 1}`} value={`${i + 1}`} />
                    ))}
                  </Picker>
                </View>
                <View style={{ flex: 1.5, minWidth: 70 }}>
                  <Text style={{
                    fontSize: 10,
                    fontWeight: '600',
                    color: '#64748b',
                    textAlign: 'center',
                    marginBottom: 2,
                  }}>
                    Year
                  </Text>
                  <Picker
                    selectedValue={tempYear}
                    onValueChange={setTempYear}
                    style={{
                      height: 50,
                      backgroundColor: '#ffffff',
                      borderRadius: 4,
                    }}
                    itemStyle={{
                      fontSize: 12,
                      color: '#1e293b',
                    }}
                    dropdownIconColor="#64748b"
                  >
                    <Picker.Item label="Year" value="" />
                    {Array.from({ length: 50 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return <Picker.Item key={year} label={`${year}`} value={`${year}`} />;
                    })}
                  </Picker>
                </View>
              </View>
            </View>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  padding: 16,
                  borderRadius: 12,
                  backgroundColor: '#f1f5f9',
                  marginRight: 8,
                  alignItems: 'center',
                }}
                onPress={() => setIsSobrietyDateModalVisible(false)}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#64748b',
                }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  padding: 16,
                  borderRadius: 12,
                  backgroundColor: '#2E8B57',
                  marginLeft: 8,
                  alignItems: 'center',
                }}
                onPress={handleSobrietyDateSave}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#ffffff',
                }}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
                  </View>
        </Modal>


      </SafeAreaView>
    );
  };

export default ProfileScreen;
