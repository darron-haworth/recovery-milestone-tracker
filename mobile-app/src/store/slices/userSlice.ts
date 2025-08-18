// User Slice
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, UserProfile, PrivacySettings } from '../../../shared/types';
import { authService } from '../../services/auth';

// Async thunks
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (profile: Partial<UserProfile>) => {
    await authService.updateProfile(profile);
    return profile;
  }
);

export const updatePrivacySettings = createAsyncThunk(
  'user/updatePrivacySettings',
  async (privacy: Partial<PrivacySettings>) => {
    await authService.updatePrivacySettings(privacy);
    return privacy;
  }
);

// User state interface
interface UserState {
  profile: UserProfile | null;
  privacy: PrivacySettings | null;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: UserState = {
  profile: null,
  privacy: null,
  isLoading: false,
  error: null,
};

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
    },
    setPrivacy: (state, action: PayloadAction<PrivacySettings>) => {
      state.privacy = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.profile) {
          state.profile = { ...state.profile, ...action.payload };
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update profile';
      });

    // Update Privacy Settings
    builder
      .addCase(updatePrivacySettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePrivacySettings.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.privacy) {
          state.privacy = { ...state.privacy, ...action.payload };
        }
      })
      .addCase(updatePrivacySettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update privacy settings';
      });
  },
});

// Export actions
export const {
  setProfile,
  setPrivacy,
  setError,
  clearError,
  setLoading,
} = userSlice.actions;

// Export selectors
export const selectProfile = (state: { user: UserState }) => state.user.profile;
export const selectPrivacy = (state: { user: UserState }) => state.user.privacy;
export const selectIsLoading = (state: { user: UserState }) => state.user.isLoading;
export const selectError = (state: { user: UserState }) => state.user.error;

export default userSlice.reducer;
