import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { checkAuthState } from '../store/slices/authSlice';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import LoadingScreen from '../components/common/LoadingScreen';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading, isOnboardingComplete } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // Check authentication state on app start
    dispatch(checkAuthState());
  }, [dispatch]);

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
        // Main app flow
        <Stack.Screen name="Main" component={TabNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
