// App Constants for Recovery Milestone Tracker

// Colors
export const COLORS = {
  // Primary Colors
  primary: '#4A90E2',
  primaryDark: '#357ABD',
  primaryLight: '#7BB3F0',
  
  // Secondary Colors
  secondary: '#50C878',
  secondaryDark: '#3DA066',
  secondaryLight: '#7DD89A',
  
  // Accent Colors
  accent: '#FF6B6B',
  accentDark: '#E55A5A',
  accentLight: '#FF8E8E',
  
  // Success/Progress Colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',
  gray: '#9E9E9E',
  grayLight: '#F5F5F5',
  grayDark: '#424242',
  
  // Background Colors
  background: '#FAFAFA',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  
  // Text Colors
  textPrimary: '#212121',
  textSecondary: '#757575',
  textDisabled: '#BDBDBD',
  
  // Border Colors
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  
  // Recovery-specific Colors
  recovery: {
    sobriety: '#4CAF50',
    milestone: '#FF9800',
    support: '#2196F3',
    hope: '#9C27B0',
    strength: '#FF5722',
    peace: '#00BCD4'
  }
};

// Typography
export const TYPOGRAPHY = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    light: 'System'
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32
  },
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    bold: '700'
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6
  }
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64
};

// Border Radius
export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 50
};

// Shadows
export const SHADOWS = {
  small: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4
  },
  large: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8
  }
};

// Layout
export const LAYOUT = {
  screenPadding: SPACING.md,
  cardPadding: SPACING.md,
  buttonHeight: 48,
  inputHeight: 48,
  headerHeight: 56,
  tabBarHeight: 80
};

// Animation
export const ANIMATION = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out'
  }
};

// API Configuration
export const API_CONFIG = {
  baseURL: 'https://api.recoverymilestonetracker.com',
  timeout: 10000,
  retryAttempts: 3,
  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout',
      refresh: '/auth/refresh',
      forgotPassword: '/auth/forgot-password',
      resetPassword: '/auth/reset-password'
    },
    user: {
      profile: '/user/profile',
      updateProfile: '/user/profile',
      deleteAccount: '/user/account'
    },
    friends: {
      list: '/friends',
      add: '/friends',
      remove: '/friends/:id',
      request: '/friends/request',
      accept: '/friends/accept',
      decline: '/friends/decline'
    },
    milestones: {
      list: '/milestones',
      create: '/milestones',
      update: '/milestones/:id',
      delete: '/milestones/:id',
      share: '/milestones/:id/share'
    },
    notifications: {
      list: '/notifications',
      markRead: '/notifications/:id/read',
      markAllRead: '/notifications/read-all',
      settings: '/notifications/settings'
    }
  }
};

// Firebase Configuration
export const FIREBASE_CONFIG = {
  // These would be replaced with actual Firebase config
  apiKey: 'your-api-key',
  authDomain: 'recovery-milestone-tracker.firebaseapp.com',
  projectId: 'recovery-milestone-tracker',
  storageBucket: 'recovery-milestone-tracker.appspot.com',
  messagingSenderId: '123456789',
  appId: 'your-app-id'
};

// Storage Keys
export const STORAGE_KEYS = {
  // Authentication
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  
  // App Settings
  ONBOARDING_COMPLETE: 'onboarding_complete',
  PRIVACY_SETTINGS: 'privacy_settings',
  NOTIFICATION_SETTINGS: 'notification_settings',
  
  // App State
  LAST_SYNC: 'last_sync',
  OFFLINE_DATA: 'offline_data',
  
  // Recovery Data
  SOBRIETY_DATE: 'sobriety_date',
  MILESTONES: 'milestones',
  FRIENDS: 'friends',
  
  // Security
  ENCRYPTION_KEY: 'encryption_key',
  BIOMETRIC_ENABLED: 'biometric_enabled'
};

// Notification Types
export const NOTIFICATION_TYPES = {
  MILESTONE_ACHIEVED: 'milestone_achieved',
  MILESTONE_REMINDER: 'milestone_reminder',
  FRIEND_REQUEST: 'friend_request',
  FRIEND_ACCEPTED: 'friend_accepted',
  ENCOURAGEMENT: 'encouragement',
  DAILY_MOTIVATION: 'daily_motivation',
  CRISIS_SUPPORT: 'crisis_support'
};

// Privacy Settings
export const PRIVACY_LEVELS = {
  PUBLIC: 'public',
  FRIENDS_ONLY: 'friends_only',
  PRIVATE: 'private',
  ANONYMOUS: 'anonymous'
};

// App Features
export const FEATURES = {
  QR_CODE_SCANNING: true,
  PUSH_NOTIFICATIONS: true,
  OFFLINE_MODE: true,
  BIOMETRIC_AUTH: true,
  ENCRYPTION: true,
  ANALYTICS: false, // Privacy-first approach
  CRASH_REPORTING: false
};

// Validation Rules
export const VALIDATION = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  password: {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
  },
  sobrietyDate: {
    maxDate: new Date(),
    message: 'Sobriety date cannot be in the future'
  }
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
  AUTH_ERROR: 'Authentication failed. Please log in again.',
  PERMISSION_ERROR: 'Permission denied. Please check your settings.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  CRISIS_MESSAGE: 'If you\'re in crisis, please reach out for help immediately.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  MILESTONE_ACHIEVED: 'Congratulations on your milestone!',
  FRIEND_ADDED: 'Friend added successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  SETTINGS_SAVED: 'Settings saved successfully!',
  DATA_SYNCED: 'Data synced successfully!'
};

// App Configuration
export const APP_CONFIG = {
  name: 'Recovery Milestone Tracker',
  version: '1.0.0',
  buildNumber: '1',
  bundleId: 'com.recovery.milestonetracker',
  supportEmail: 'support@recoverymilestonetracker.com',
  privacyPolicyUrl: 'https://recoverymilestonetracker.com/privacy',
  termsOfServiceUrl: 'https://recoverymilestonetracker.com/terms',
  websiteUrl: 'https://recoverymilestonetracker.com'
};
