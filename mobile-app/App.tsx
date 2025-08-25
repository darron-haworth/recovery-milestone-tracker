import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store';
import { AuthProvider } from './src/context/AuthContext.tsx';
import { FriendsProvider } from './src/context/FriendsContext.tsx';
import { NotificationProvider } from './src/context/NotificationContext.tsx';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/common/ErrorBoundary';
import LoadingScreen from './src/components/common/LoadingScreen';
import { COLORS } from './src/constants';

// Initialize Firebase
import { initializeFirebase } from './src/services/firebase';
import { authService } from './src/services/auth';

const App: React.FC = () => {
  // Initialize Firebase and services when app starts
  useEffect(() => {
    try {
      // Initialize Firebase first
      initializeFirebase();
      
      // Then initialize auth service after Firebase is ready
      setTimeout(() => {
        authService.initialize();
      }, 100);
    } catch (error) {
      console.error('Firebase initialization error:', error);
    }
  }, []);

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={<LoadingScreen />} persistor={persistor}>
          <SafeAreaProvider>
            <NavigationContainer
              theme={{
                dark: false,
                colors: {
                  primary: COLORS.primary,
                  background: COLORS.background,
                  card: COLORS.card,
                  text: COLORS.textPrimary,
                  border: COLORS.border,
                  notification: COLORS.accent,
                },
              }}
            >
              <AuthProvider>
                <FriendsProvider>
                  <NotificationProvider>
                    <AppNavigator />
                  </NotificationProvider>
                </FriendsProvider>
              </AuthProvider>
            </NavigationContainer>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
