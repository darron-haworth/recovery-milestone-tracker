// Core Types for Recovery Milestone Tracker

export type RecoveryType = 'Alcoholism' | 'Drug_Addiction' | 'Gambling' | 'Other';
export type Fellowship = 'AA' | 'NA' | 'GA' | 'CA' | 'MA' | 'HA' | 'SA' | 'Other';
export type MilestoneCategory = 'early' | 'foundation' | 'extended' | 'annual';
export type FriendType = 'manual' | 'connected';
export type NotificationType = 'milestone' | 'friend_request' | 'encouragement';

// User & Authentication
export interface User {
  uid: string;
  email: string;
  profile: UserProfile;
  privacy: PrivacySettings;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  recoveryType: RecoveryType;
  sobrietyDate: string;
  fellowship: Fellowship;
  anonymousId: string;
  firstName?: string;
  lastInitial?: string;
  nickname?: string;
  avatar?: string;
  bio?: string;
}

export interface PrivacySettings {
  isAnonymous: boolean;
  shareMilestones: boolean;
  allowFriendRequests: boolean;
  showInDirectory: boolean;
  notificationSettings: NotificationSettings;
}

export interface NotificationSettings {
  milestoneReminders: boolean;
  friendRequests: boolean;
  encouragementMessages: boolean;
  dailyMotivation: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
}

// Friends & Connections
export interface Friend {
  friendId: string;
  userId: string;
  type: FriendType;
  profile: FriendProfile;
  connection: ConnectionInfo;
  notifications: NotificationSettings;
  createdAt: string;
  updatedAt: string;
}

export interface FriendProfile {
  anonymousId: string;
  recoveryType: RecoveryType;
  sobrietyDate: string;
  fellowship: Fellowship;
  firstName?: string;
  lastInitial?: string;
  nickname?: string;
  avatar?: string;
  bio?: string;
}

export interface ConnectionInfo {
  connectionDate: string;
  connectionMethod: 'qr_code' | 'manual' | 'directory';
  sharedMilestones: boolean;
  lastInteraction: string;
}

// Milestones
export interface Milestone {
  days: number;
  label: string;
  category: MilestoneCategory;
  date?: string;
  achieved?: boolean;
  description?: string;
  icon?: string;
}

export interface UserMilestone {
  userId: string;
  milestone: Milestone;
  achievedDate: string;
  sharedWithFriends: boolean;
  notes?: string;
  createdAt: string;
}

// Notifications
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
}

// API Responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Onboarding: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Milestones: undefined;
  Friends: undefined;
  Profile: undefined;
  Settings: undefined;
};

export type MilestoneStackParamList = {
  MilestonesList: undefined;
  MilestoneDetails: { milestoneId: string };
  AddMilestone: undefined;
};

export type FriendStackParamList = {
  FriendsList: undefined;
  FriendDetails: { friendId: string };
  AddFriend: undefined;
  QRScanner: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
  PrivacySettings: undefined;
  NotificationSettings: undefined;
};
