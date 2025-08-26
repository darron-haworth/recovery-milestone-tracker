import React from 'react';
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
import { authService } from '../../services/auth';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { COLORS, TYPOGRAPHY, SPACING } from '../../constants';
import { signOut, clearStoredAuthData } from '../../store/slices/authSlice';

const ApiTestScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

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

  // Test friends endpoints
  const friendsListTest = useGet(API_ENDPOINTS.FRIENDS.LIST);
  const friendRequestsTest = useGet(API_ENDPOINTS.FRIENDS.REQUESTS);
  const friendSuggestionsTest = useGet(API_ENDPOINTS.FRIENDS.SUGGESTIONS);

  // Test milestones endpoints
  const milestonesListTest = useGet(API_ENDPOINTS.MILESTONES.LIST);
  const standardMilestonesTest = useGet(API_ENDPOINTS.MILESTONES.STANDARD);
  const createMilestoneTest = usePost(API_ENDPOINTS.MILESTONES.CREATE);

  // Test notifications endpoints
  const notificationsListTest = useGet(API_ENDPOINTS.NOTIFICATIONS.LIST);
  const unreadCountTest = useGet(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
  const testNotificationTest = usePost(API_ENDPOINTS.NOTIFICATIONS.TEST);

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

  const handleCreateMilestoneTest = async () => {
    try {
      const response = await createMilestoneTest.execute({
        title: 'Test Milestone',
        description: 'A test milestone for API testing',
        daysRequired: 7,
        category: 'weekly',
        icon: 'star',
        color: '#007AFF',
      });
      
      if (response?.success) {
        Alert.alert('Success', 'Create milestone test passed!');
      }
    } catch (error) {
      Alert.alert('Error', `Create milestone test failed: ${error}`);
    }
  };

  const handleTestNotificationTest = async () => {
    try {
      const response = await testNotificationTest.execute();
      
      if (response?.success) {
        Alert.alert('Success', 'Test notification sent!');
      }
    } catch (error) {
      Alert.alert('Error', `Test notification failed: ${error}`);
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(signOut());
      Alert.alert('Success', 'Logged out successfully');
    } catch (error: any) {
      Alert.alert('Error', 'Failed to logout: ' + error.message);
    }
  };

  const handleClearData = async () => {
    try {
      await authService.clearStoredData();
      Alert.alert('Success', 'All stored data cleared. Please restart the app.');
    } catch (error: any) {
      Alert.alert('Error', 'Failed to clear data: ' + error.message);
    }
  };

  const handleClearStoredAuthData = async () => {
    try {
      await dispatch(clearStoredAuthData());
      Alert.alert('Success', 'Stored auth data cleared. You should now see the login screen.');
    } catch (error: any) {
      Alert.alert('Error', 'Failed to clear auth data: ' + error.message);
    }
  };

  const handleRestartApp = () => {
    Alert.alert(
      'Restart App',
      'Please manually close and restart the app to see the login screen.',
      [{ text: 'OK' }]
    );
  };

  const renderTestResult = (
    title: string,
    result: any,
    isLoading: boolean = false
  ) => (
    <View style={styles.testResult}>
      <Text style={styles.testResultTitle}>{title}</Text>
      {isLoading ? (
        <Text style={styles.testResultText}>Loading...</Text>
      ) : (
        <Text style={styles.testResultText}>
          {result ? JSON.stringify(result, null, 2) : 'No result'}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>API Test Screen</Text>
          <Text style={styles.subtitle}>
            Test your backend API endpoints and app functionality
          </Text>
        </View>

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

        {/* Friends Tests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Friends Tests</Text>
          
          <TouchableOpacity
            style={styles.testButton}
            onPress={() => friendsListTest.execute()}
            disabled={friendsListTest.loading}
          >
            <Text style={styles.buttonText}>
              {friendsListTest.loading ? 'Testing...' : 'Test Friends List'}
            </Text>
          </TouchableOpacity>
          {renderTestResult('Friends List', friendsListTest)}

          <TouchableOpacity
            style={styles.testButton}
            onPress={() => friendRequestsTest.execute()}
            disabled={friendRequestsTest.loading}
          >
            <Text style={styles.buttonText}>
              {friendRequestsTest.loading ? 'Testing...' : 'Test Friend Requests'}
            </Text>
          </TouchableOpacity>
          {renderTestResult('Friend Requests', friendRequestsTest)}

          <TouchableOpacity
            style={styles.testButton}
            onPress={() => friendSuggestionsTest.execute()}
            disabled={friendSuggestionsTest.loading}
          >
            <Text style={styles.buttonText}>
              {friendSuggestionsTest.loading ? 'Testing...' : 'Test Friend Suggestions'}
            </Text>
          </TouchableOpacity>
          {renderTestResult('Friend Suggestions', friendSuggestionsTest)}
        </View>

        {/* Milestones Tests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Milestones Tests</Text>
          
          <TouchableOpacity
            style={styles.testButton}
            onPress={() => milestonesListTest.execute()}
            disabled={milestonesListTest.loading}
          >
            <Text style={styles.buttonText}>
              {milestonesListTest.loading ? 'Testing...' : 'Test Milestones List'}
            </Text>
          </TouchableOpacity>
          {renderTestResult('Milestones List', milestonesListTest)}

          <TouchableOpacity
            style={styles.testButton}
            onPress={() => standardMilestonesTest.execute()}
            disabled={standardMilestonesTest.loading}
          >
            <Text style={styles.buttonText}>
              {standardMilestonesTest.loading ? 'Testing...' : 'Test Standard Milestones'}
            </Text>
          </TouchableOpacity>
          {renderTestResult('Standard Milestones', standardMilestonesTest)}

          <TouchableOpacity
            style={styles.testButton}
            onPress={handleCreateMilestoneTest}
            disabled={createMilestoneTest.loading}
          >
            <Text style={styles.buttonText}>
              {createMilestoneTest.loading ? 'Testing...' : 'Test Create Milestone'}
            </Text>
          </TouchableOpacity>
          {renderTestResult('Create Milestone', createMilestoneTest)}
        </View>

        {/* Notifications Tests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications Tests</Text>
          
          <TouchableOpacity
            style={styles.testButton}
            onPress={() => notificationsListTest.execute()}
            disabled={notificationsListTest.loading}
          >
            <Text style={styles.buttonText}>
              {notificationsListTest.loading ? 'Testing...' : 'Test Notifications List'}
            </Text>
          </TouchableOpacity>
          {renderTestResult('Notifications List', notificationsListTest)}

          <TouchableOpacity
            style={styles.testButton}
            onPress={() => unreadCountTest.execute()}
            disabled={unreadCountTest.loading}
          >
            <Text style={styles.buttonText}>
              {unreadCountTest.loading ? 'Testing...' : 'Test Unread Count'}
            </Text>
          </TouchableOpacity>
          {renderTestResult('Unread Count', unreadCountTest)}

          <TouchableOpacity
            style={styles.testButton}
            onPress={handleTestNotificationTest}
            disabled={testNotificationTest.loading}
          >
            <Text style={styles.buttonText}>
              {testNotificationTest.loading ? 'Testing...' : 'Test Send Notification'}
            </Text>
          </TouchableOpacity>
          {renderTestResult('Send Test Notification', testNotificationTest)}
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
          <Text style={styles.infoText}>
            API Version: 1.0.0
          </Text>
        </View>

        {/* App Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Management</Text>
          <TouchableOpacity
            style={styles.testButton}
            onPress={handleLogout}
            disabled={false} // No loading state for logout
          >
            <Text style={styles.buttonText}>
              Log Out
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.testButton}
            onPress={handleClearData}
            disabled={false} // No loading state for clear data
          >
            <Text style={styles.buttonText}>
              Clear All Data
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.testButton}
            onPress={handleClearStoredAuthData}
            disabled={false} // No loading state for clear auth data
          >
            <Text style={styles.buttonText}>
              Clear Stored Auth Data
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.testButton}
            onPress={handleRestartApp}
            disabled={false} // No loading state for restart app
          >
            <Text style={styles.buttonText}>
              Restart App
            </Text>
          </TouchableOpacity>
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
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
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
  testResultTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#666',
  },
  testResultText: {
    fontSize: 12,
    color: '#666',
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
