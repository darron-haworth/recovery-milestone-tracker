import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingScreen from '../components/common/LoadingScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import { RootState } from '../store';
import { checkAuthState } from '../store/slices/authSlice';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);
  const { isAuthenticated, isLoading, isOnboardingComplete } = authState || {};

  useEffect(() => {
    // Check authentication state on app start
    dispatch(checkAuthState() as any);
  }, [dispatch]);

  // Add debugging
  console.log('🔍 AppNavigator state:', { isAuthenticated, isLoading, isOnboardingComplete });

  if (isLoading) {
    return <LoadingScreen message="Starting Recovery Milestone Tracker..." />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!isOnboardingComplete ? (
        // Onboarding flow
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : !isAuthenticated ? (
        // Authentication flow
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        // Main app flow - use key to force re-render and reset tab state
        <Stack.Screen 
          name="Main" 
          component={TabNavigator} 
          key={`main-${isAuthenticated}`}
        />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
