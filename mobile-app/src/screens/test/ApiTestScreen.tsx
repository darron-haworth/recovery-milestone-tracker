import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGet, usePost } from '../../hooks/useApi';
import { API_ENDPOINTS } from '../../services/api';

const ApiTestScreen: React.FC = () => {
  // Test health endpoint
  const healthCheck = useGet(API_ENDPOINTS.HEALTH, {
    immediate: true,
    retryCount: 2,
  });

  // Test auth endpoints
  const signupTest = usePost(API_ENDPOINTS.AUTH.SIGNUP);
  const loginTest = usePost(API_ENDPOINTS.AUTH.LOGIN);
  const forgotPasswordTest = usePost(API_ENDPOINTS.AUTH.FORGOT_PASSWORD);

  // Test user endpoints
  const userProfileTest = useGet(API_ENDPOINTS.USER.PROFILE);

  const handleSignupTest = async () => {
    try {
      const response = await signupTest.execute({
        email: 'test@example.com',
        password: 'password123',
        displayName: 'Test User',
      });
      
      if (response?.success) {
        Alert.alert('Success', 'Signup test passed!');
      }
    } catch (error) {
      Alert.alert('Error', `Signup test failed: ${error}`);
    }
  };

  const handleLoginTest = async () => {
    try {
      const response = await loginTest.execute({
        email: 'test@example.com',
        password: 'password123',
      });
      
      if (response?.success) {
        Alert.alert('Success', 'Login test passed!');
      }
    } catch (error) {
      Alert.alert('Error', `Login test failed: ${error}`);
    }
  };

  const handleForgotPasswordTest = async () => {
    try {
      const response = await forgotPasswordTest.execute({
        email: 'test@example.com',
      });
      
      if (response?.success) {
        Alert.alert('Success', 'Forgot password test passed!');
      }
    } catch (error) {
      Alert.alert('Error', `Forgot password test failed: ${error}`);
    }
  };

  const handleUserProfileTest = async () => {
    try {
      const response = await userProfileTest.execute();
      
      if (response?.success) {
        Alert.alert('Success', 'User profile test passed!');
      }
    } catch (error) {
      Alert.alert('Error', `User profile test failed: ${error}`);
    }
  };

  const renderTestResult = (
    title: string,
    result: { loading: boolean; error: string | null; success: boolean; data: any }
  ) => (
    <View style={styles.testResult}>
      <Text style={styles.testTitle}>{title}</Text>
      <View style={styles.statusContainer}>
        {result.loading && <Text style={styles.loading}>Loading...</Text>}
        {result.error && <Text style={styles.error}>Error: {result.error}</Text>}
        {result.success && <Text style={styles.success}>Success!</Text>}
        {result.data && (
          <Text style={styles.data}>
            Data: {JSON.stringify(result.data, null, 2)}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.header}>API Connection Test</Text>
        
        {/* Health Check */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Check</Text>
          {renderTestResult('Server Health', healthCheck)}
        </View>

        {/* Auth Tests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Authentication Tests</Text>
          
          <TouchableOpacity
            style={styles.testButton}
            onPress={handleSignupTest}
            disabled={signupTest.loading}
          >
            <Text style={styles.buttonText}>
              {signupTest.loading ? 'Testing...' : 'Test Signup'}
            </Text>
          </TouchableOpacity>
          {renderTestResult('Signup', signupTest)}

          <TouchableOpacity
            style={styles.testButton}
            onPress={handleLoginTest}
            disabled={loginTest.loading}
          >
            <Text style={styles.buttonText}>
              {loginTest.loading ? 'Testing...' : 'Test Login'}
            </Text>
          </TouchableOpacity>
          {renderTestResult('Login', loginTest)}

          <TouchableOpacity
            style={styles.testButton}
            onPress={handleForgotPasswordTest}
            disabled={forgotPasswordTest.loading}
          >
            <Text style={styles.buttonText}>
              {forgotPasswordTest.loading ? 'Testing...' : 'Test Forgot Password'}
            </Text>
          </TouchableOpacity>
          {renderTestResult('Forgot Password', forgotPasswordTest)}
        </View>

        {/* User Tests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Tests</Text>
          
          <TouchableOpacity
            style={styles.testButton}
            onPress={handleUserProfileTest}
            disabled={userProfileTest.loading}
          >
            <Text style={styles.buttonText}>
              {userProfileTest.loading ? 'Testing...' : 'Test User Profile'}
            </Text>
          </TouchableOpacity>
          {renderTestResult('User Profile', userProfileTest)}
        </View>

        {/* Connection Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connection Information</Text>
          <Text style={styles.infoText}>
            Base URL: {__DEV__ ? 'http://localhost:3000' : 'Production URL'}
          </Text>
          <Text style={styles.infoText}>
            Environment: {__DEV__ ? 'Development' : 'Production'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  testResult: {
    marginBottom: 16,
  },
  testTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#666',
  },
  statusContainer: {
    marginTop: 4,
  },
  loading: {
    color: '#007AFF',
    fontSize: 12,
  },
  error: {
    color: '#FF3B30',
    fontSize: 12,
  },
  success: {
    color: '#34C759',
    fontSize: 12,
  },
  data: {
    color: '#666',
    fontSize: 10,
    marginTop: 4,
    fontFamily: 'monospace',
  },
  testButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
});

export default ApiTestScreen;
