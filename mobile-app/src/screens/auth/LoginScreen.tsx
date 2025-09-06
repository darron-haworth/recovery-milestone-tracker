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
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { signIn } from '../../store/slices/authSlice';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const authState = useSelector((state: RootState) => state.auth);
  const { isLoading, error } = authState || {};

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      // Dispatch Redux action for sign in
      const result = await dispatch(signIn({ email, password }));
      
      if (signIn.fulfilled.match(result)) {
        console.log('Login successful:', result.payload);
        // Navigation will happen automatically via Redux state change
      } else {
        console.error('Login failed:', result.error);
        Alert.alert('Login Failed', result.error?.message || 'An error occurred during login');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', error.message || 'An error occurred during login');
    }
  };

  // Show error if there is one
  React.useEffect(() => {
    if (error) {
      Alert.alert('Login Error', error);
    }
  }, [error]);

  const handleSignUpPress = () => {
    navigation.navigate('SignUp' as never);
  };

  const handleForgotPasswordPress = () => {
    navigation.navigate('ForgotPassword' as never);
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
          {/* Header with gradient background - tight spacing */}
          <LinearGradient
            colors={['#2E8B57', '#66CDAA']}
            style={styles.headerGradient}
          >
            <View style={styles.header}>
              <Text style={styles.appTitle}>Our Time Recovered</Text>
              <Text style={styles.tagline}>Sign up or login to continue! 🚀</Text>
              
              {/* Logo Section */}
              <View style={styles.logoSection}>
                <View style={styles.logoContainer}>
                  {/* Empty space for visual balance */}
                </View>
              </View>
            </View>
          </LinearGradient>

          {/* White Overlay Box with Clock/Prayer Icons and Sign-up Text */}
          <View style={styles.overlayBox}>
            <View style={styles.overlayContent}>
              <Text style={styles.signUpPrompt}>🚀 Celebrating our recovery milestones</Text>
              <View style={{ height: 16 }} />
              <View style={[styles.iconRow, { marginBottom: -8 }]}>
                <Text style={styles.overlayIcon}>⏰</Text>
                <Text style={styles.hoursText}>24 hours at a time</Text>
                <Text style={styles.overlayIcon}>🙏</Text>
              </View>
            </View>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            {/* Email Input Card */}
            <View style={styles.inputCard}>
              <View style={styles.inputHeader}>
                <View style={styles.inputIcon}>
                  <Icon name="alternate-email" size={16} color="#8b5cf6" />
                </View>
                <Text style={styles.inputLabel}>Login ID</Text>
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
              />
            </View>

            {/* Password Input Card */}
            <View style={styles.inputCard}>
              <View style={styles.inputHeader}>
                <View style={styles.inputIcon}>
                  <Icon name="lock" size={16} color="#8b5cf6" />
                </View>
                <Text style={styles.inputLabel}>Password</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#94a3b8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Login Button - matching Encourage button style */}
            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#2E8B57" size="small" />
              ) : (
                <>
                  <Icon name="login" size={16} color="#2E8B57" />
                  <Text style={styles.loginButtonText}>Sign In Now</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <TouchableOpacity style={styles.signUpTouchable} onPress={handleSignUpPress}>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPasswordPress}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerGradient: {
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 2,
    alignItems: 'center',
    maxWidth: 400,
  },

  formContainer: {
    padding: 16,
    paddingTop: 16,
    maxWidth: 420,
    alignSelf: 'center',
    width: '100%',
  },
  inputCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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

  inputLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1e293b',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f9f0',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2E8B57',
    marginTop: 8,
    marginBottom: 20,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#2E8B57',
    fontWeight: '500',
    marginLeft: 6,
    fontSize: 16,
  },
  forgotPassword: {
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  forgotPasswordText: {
    color: '#2E8B57',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  signUpText: {
    color: '#64748b',
    fontSize: 16,
  },
  signUpTouchable: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  signUpLink: {
    color: '#2E8B57',
    fontSize: 16,
    fontWeight: '700',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 16,
  },
  logoSection: {
    marginBottom: 8,
    alignItems: 'center',
  },

  logoDescription: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  overlayBox: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: -25,
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
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 12,
  },
  overlayIcon: {
    fontSize: 24,
  },
  hoursText: {
    fontSize: 16,
    color: '#2E8B57',
    fontWeight: 'bold',
    marginHorizontal: 12,
  },
  signUpPrompt: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E8B57',
    textAlign: 'center',
  },

});

export default LoginScreen;
