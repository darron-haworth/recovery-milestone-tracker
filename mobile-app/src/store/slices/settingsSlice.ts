// Settings Slice
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Settings state interface
interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notifications: {
    enabled: boolean;
    milestoneReminders: boolean;
    friendRequests: boolean;
    encouragementMessages: boolean;
    dailyMotivation: boolean;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
  };
  privacy: {
    shareMilestones: boolean;
    allowFriendRequests: boolean;
    showInDirectory: boolean;
    analyticsEnabled: boolean;
  };
  recovery: {
    showCrisisResources: boolean;
    enableEncouragement: boolean;
    milestoneSharing: boolean;
  };
  app: {
    autoBackup: boolean;
    dataSync: boolean;
    offlineMode: boolean;
  };
}

// Initial state
const initialState: SettingsState = {
  theme: 'system',
  language: 'en',
  notifications: {
    enabled: true,
    milestoneReminders: true,
    friendRequests: true,
    encouragementMessages: true,
    dailyMotivation: true,
    soundEnabled: true,
    vibrationEnabled: true,
  },
  privacy: {
    shareMilestones: true,
    allowFriendRequests: true,
    showInDirectory: false,
    analyticsEnabled: false,
  },
  recovery: {
    showCrisisResources: true,
    enableEncouragement: true,
    milestoneSharing: true,
  },
  app: {
    autoBackup: true,
    dataSync: true,
    offlineMode: true,
  },
};

// Settings slice
const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    updateNotificationSettings: (state, action: PayloadAction<Partial<SettingsState['notifications']>>) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    updatePrivacySettings: (state, action: PayloadAction<Partial<SettingsState['privacy']>>) => {
      state.privacy = { ...state.privacy, ...action.payload };
    },
    updateRecoverySettings: (state, action: PayloadAction<Partial<SettingsState['recovery']>>) => {
      state.recovery = { ...state.recovery, ...action.payload };
    },
    updateAppSettings: (state, action: PayloadAction<Partial<SettingsState['app']>>) => {
      state.app = { ...state.app, ...action.payload };
    },
    resetSettings: (state) => {
      return { ...initialState };
    },
    importSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

// Export actions
export const {
  setTheme,
  setLanguage,
  updateNotificationSettings,
  updatePrivacySettings,
  updateRecoverySettings,
  updateAppSettings,
  resetSettings,
  importSettings,
} = settingsSlice.actions;

// Export selectors
export const selectTheme = (state: { settings: SettingsState }) => state.settings.theme;
export const selectLanguage = (state: { settings: SettingsState }) => state.settings.language;
export const selectNotificationSettings = (state: { settings: SettingsState }) => state.settings.notifications;
export const selectPrivacySettings = (state: { settings: SettingsState }) => state.settings.privacy;
export const selectRecoverySettings = (state: { settings: SettingsState }) => state.settings.recovery;
export const selectAppSettings = (state: { settings: SettingsState }) => state.settings.app;

export default settingsSlice.reducer;
