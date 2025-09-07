import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { authService } from '../../services/auth';

const SignUpScreen: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastInitial, setLastInitial] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const navigation = useNavigation();

  const handleSignUp = async () => {
    if (!firstName || !lastInitial || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (lastInitial.length !== 1) {
      Alert.alert('Privacy Notice', 'Last initial must be exactly 1 character for maximum anonymity protection.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      // Initialize auth service if not already done
      if (!authService.isInitialized) {
        authService.initialize();
      }

      // Create user profile
      const profile = {
        firstName: firstName.trim(),
        lastInitial: lastInitial.trim().toUpperCase(),
        nickname: nickname.trim() || firstName.trim(),
        recoveryType: 'Alcoholism' as const,
        sobrietyDate: new Date().toISOString(),
      };

      // Attempt to sign up
      const user = await authService.signUp(email, password, profile);
      console.log('Sign up successful:', user);
      setSignupSuccess(true);
      Alert.alert('Success', 'Account created successfully! You can now sign in.');
    } catch (error: any) {
      console.error('Sign up error:', error);
      Alert.alert('Sign Up Failed', error.message || 'An error occurred during sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInPress = () => {
    navigation.navigate('Login' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header with gradient background */}
          <LinearGradient
            colors={['#2E8B57', '#66CDAA']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>🚀</Text>
              </View>
            </View>
            
            <Text style={styles.title}>Create Account</Text>
          </LinearGradient>

          {/* White Overlay Box with Tagline */}
          <View style={styles.overlayBox}>
            <View style={styles.overlayContent}>
              <Text style={styles.taglineText}>🚀 Celebrating our recovery milestones</Text>
            </View>
          </View>

          {/* Sign Up Form */}
          <View style={styles.formContainer}>
            {/* Name Input Card */}
            <View style={styles.inputCard}>
              <View style={styles.inputHeader}>
                <View style={styles.inputIcon}>
                  <Text style={styles.iconText}>👤</Text>
                </View>
                <View style={styles.nameLabelsRow}>
                  <Text style={styles.inputLabel}>First Name</Text>
                  <Text style={styles.inputLabel}>Initial</Text>
                </View>
              </View>
              <View style={styles.nameInputsRow}>
                <TextInput
                  style={styles.firstNameInput}
                  placeholder="First name"
                  placeholderTextColor="#94a3b8"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                  autoCorrect={false}
                  editable={!isLoading}
                />
                <TextInput
                  style={styles.initialInput}
                  placeholder="L"
                  placeholderTextColor="#94a3b8"
                  value={lastInitial}
                  onChangeText={(text) => {
                    // Ensure only 1 character maximum for privacy
                    if (text.length <= 1) {
                      setLastInitial(text.toUpperCase());
                    }
                  }}
                  maxLength={1}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Nickname Input Card */}
            <View style={styles.inputCard}>
              <View style={styles.inputHeader}>
                <View style={styles.inputIcon}>
                  <Text style={styles.iconText}>🏷️</Text>
                </View>
                <Text style={styles.inputLabel}>Nickname (Optional)</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter a nickname (optional)"
                placeholderTextColor="#94a3b8"
                value={nickname}
                onChangeText={setNickname}
                autoCapitalize="words"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            {/* Email Input Card */}
            <View style={styles.inputCard}>
              <View style={styles.inputHeader}>
                <View style={styles.inputIcon}>
                  <Text style={styles.iconText}>📧</Text>
                </View>
                <Text style={styles.inputLabel}>Login Id</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#94a3b8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            {/* Password Input Card */}
            <View style={styles.inputCard}>
              <View style={styles.inputHeader}>
                <View style={styles.inputIcon}>
                  <Text style={styles.iconText}>🔒</Text>
                </View>
                <Text style={styles.inputLabel}>Password</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Create a password"
                placeholderTextColor="#94a3b8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            {/* Confirm Password Input Card */}
            <View style={styles.inputCard}>
              <View style={styles.inputHeader}>
                <View style={styles.inputIcon}>
                  <Text style={styles.iconText}>✅</Text>
                </View>
                <Text style={styles.inputLabel}>Confirm Password</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                placeholderTextColor="#94a3b8"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            {/* Success Message */}
            {signupSuccess && (
              <View style={styles.successMessage}>
                <Text style={styles.successText}>
                  ✅ Account created successfully! Click "Sign In" to continue.
                </Text>
              </View>
            )}

            {/* Sign Up Button */}
            <TouchableOpacity 
              style={[styles.signUpButton, (isLoading || signupSuccess) && styles.signUpButtonDisabled]} 
              onPress={signupSuccess ? handleSignInPress : handleSignUp}
              disabled={isLoading}
            >
              <LinearGradient
                colors={signupSuccess ? ['#4CAF50', '#66BB6A'] : ['#2E8B57', '#66CDAA']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text style={styles.signUpButtonText}>
                    {signupSuccess ? 'Sign In' : 'Create Account'}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Sign In Link */}
            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already have an account? </Text>
              <TouchableOpacity style={styles.signInTouchable} onPress={handleSignInPress}>
                <Text style={styles.signInLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 32,
    elevation: 8,
  },
  logoContainer: {
    marginBottom: 15,
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoText: {
    fontSize: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 22,
  },
  formContainer: {
    padding: 20,
    paddingTop: 25,
    maxWidth: 420,
    alignSelf: 'center',
    width: '100%',
  },
  inputCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  iconText: {
    fontSize: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  nameLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
  },
  nameInputsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  firstNameInput: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  initialInput: {
    width: 60,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
    textAlign: 'center',
  },
  overlayBox: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: -15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overlayContent: {
    padding: 16,
    alignItems: 'center',
  },
  taglineText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E8B57',
    textAlign: 'center',
  },
  signUpButton: {
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 20,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  signUpButtonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  signUpButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    color: '#64748b',
    fontSize: 16,
  },
  signInTouchable: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  signInLink: {
    color: '#6366f1',
    fontSize: 16,
    fontWeight: '700',
  },
  successMessage: {
    backgroundColor: '#E8F5E8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  successText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default SignUpScreen;
