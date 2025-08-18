import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store';
import { AuthProvider } from './src/context/AuthContext';
import { FriendsProvider } from './src/context/FriendsContext';
import { NotificationProvider } from './src/context/NotificationContext';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/common/ErrorBoundary';
import LoadingScreen from './src/components/common/LoadingScreen';
import { COLORS } from '../shared/constants';

// Initialize Firebase
import './src/services/firebase';

const App: React.FC = () => {
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
