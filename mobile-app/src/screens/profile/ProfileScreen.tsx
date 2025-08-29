
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
    const diffTime = Math.abs(now.getTime() - startDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const remainingDays = diffDays % 365;
    return { years, days: remainingDays, totalDays: diffDays };
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

  const sobrietyTime = tempSobrietyDate ? calculateSobrietyTime(tempSobrietyDate) : { years: 0, days: 0, totalDays: 0 };
  const displayName = tempFirstName && tempLastInitial ? `${tempFirstName} ${tempLastInitial}` : 'Set Your Name';
  const initials = displayName !== 'Set Your Name' ? displayName.split(' ').map(n => n[0]).join('') : '?';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView style={{ flex: 1 }}>
        {/* Header with gradient background */}
        <LinearGradient
          colors={['#6366f1', '#8b5cf6']}
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
          
          {/* Name Card */}
          <TouchableOpacity
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 12,
              padding: 10,
              marginTop: 1,
              marginBottom: 6,
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
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: '#f1f5f9',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 8,
              }}>
                <Text style={{ fontSize: 16 }}>👤</Text>
              </View>
              <Text style={{
                fontSize: 16,
                fontWeight: '700',
                color: '#1e293b',
              }}>
                Name
              </Text>
            </View>
            <Text style={{
              fontSize: 16,
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
              marginBottom: 6,
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
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: '#f1f5f9',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 8,
              }}>
                <Text style={{ fontSize: 16 }}>🏷️</Text>
              </View>
              <Text style={{
                fontSize: 16,
                fontWeight: '700',
                color: '#1e293b',
              }}>
                Nickname
              </Text>
            </View>
            <Text style={{
              fontSize: 16,
              color: '#64748b',
              fontWeight: '600',
            }}>
              @{tempNickname || 'Set nickname'}
            </Text>
          </TouchableOpacity>

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
              marginBottom: 6,
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
            }}>
              {tempRecoveryType.replace(/_/g, ' ')}
            </Text>
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
              marginBottom: 6,
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
                  fontSize: 40,
                  fontWeight: 'bold',
                  color: '#6366f1',
                  lineHeight: 40,
                }}>
                  {sobrietyTime.years}
                </Text>
                <Text style={{
                  fontSize: 16,
                  color: '#64748b',
                  marginTop: 8,
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}>
                  Years
                </Text>
              </View>
              
              <View style={{
                width: 2,
                height: 60,
                backgroundColor: '#d1d5db',
                marginHorizontal: 24,
                borderRadius: 2,
              }} />
              
              <View style={{
                flex: 1,
                alignItems: 'center',
              }}>
                <Text style={{
                  fontSize: 40,
                  fontWeight: 'bold',
                  color: '#6366f1',
                  lineHeight: 40,
                }}>
                  {sobrietyTime.days}
                </Text>
                <Text style={{
                  fontSize: 16,
                  color: '#64748b',
                  marginTop: 8,
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
              backgroundColor: '#ffffff',
              borderRadius: 16,
              padding: 12,
              width: '100%',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.08,
              shadowRadius: 20,
              elevation: 4,
              borderWidth: 2,
              borderColor: '#fee2e2',
            }}
            onPress={handleLogout}
          >
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: '#dc2626',
              marginBottom: 6,
            }}>
              Logout
            </Text>
            <Text style={{
              fontSize: 15,
              color: '#64748b',
              fontWeight: '500',
            }}>
              {user.email}
            </Text>
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
                  backgroundColor: '#6366f1',
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
                  backgroundColor: '#6366f1',
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
                    backgroundColor: tempRecoveryType === type ? '#6366f1' : '#f8fafc',
                    marginBottom: 8,
                    borderWidth: 1,
                    borderColor: tempRecoveryType === type ? '#6366f1' : '#e2e8f0',
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
                  backgroundColor: '#6366f1',
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
            width: '80%',
            maxWidth: 400,
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
                Enter your sobriety date:
              </Text>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
                <TextInput
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: '#e2e8f0',
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 16,
                    backgroundColor: '#f8fafc',
                    marginRight: 8,
                  }}
                  placeholder="MM"
                  value={tempMonth}
                  onChangeText={setTempMonth}
                  maxLength={2}
                  keyboardType="numeric"
                />
                <TextInput
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: '#e2e8f0',
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 16,
                    backgroundColor: '#f8fafc',
                    marginRight: 8,
                  }}
                  placeholder="DD"
                  value={tempDay}
                  onChangeText={setTempDay}
                  maxLength={2}
                  keyboardType="numeric"
                />
                <TextInput
                  style={{
                    flex: 1.5,
                    borderWidth: 1,
                    borderColor: '#e2e8f0',
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 16,
                    backgroundColor: '#f8fafc',
                  }}
                  placeholder="YYYY"
                  value={tempYear}
                  onChangeText={setTempYear}
                  maxLength={4}
                  keyboardType="numeric"
                />
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
                  backgroundColor: '#6366f1',
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
