// Redux Store Configuration
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import { encrypt, decrypt } from '../utils/encryption';

// Import slices
import authSlice from './slices/authSlice';
import userSlice from './slices/userSlice';
import friendsSlice from './slices/friendsSlice';
import milestonesSlice from './slices/milestonesSlice';
import notificationsSlice from './slices/notificationsSlice';
import settingsSlice from './slices/settingsSlice';

// Create encrypted transform for sensitive data
const encryptTransformConfig = encryptTransform({
  secretKey: 'recovery-milestone-tracker-redux-key',
  onError: (error) => {
    console.error('Redux persist encryption error:', error);
  },
});

// Persist configuration
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  transforms: [encryptTransformConfig],
  whitelist: ['auth', 'user', 'settings'], // Only persist these slices
  blacklist: ['notifications'], // Don't persist these slices
};

// Combine all reducers
const rootReducer = combineReducers({
  auth: authSlice,
  user: userSlice,
  friends: friendsSlice,
  milestones: milestonesSlice,
  notifications: notificationsSlice,
  settings: settingsSlice,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['persist'],
      },
      immutableCheck: {
        ignoredPaths: ['persist'],
      },
    }),
  devTools: __DEV__,
});

// Create persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
