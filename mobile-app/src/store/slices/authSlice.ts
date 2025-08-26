// Auth Slice
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../services/auth';
import { User } from '../../types';

// Async thunks
export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }: { email: string; password: string }) => {
    const user = await authService.signIn(email, password);
    return user;
  }
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ 
    email, 
    password, 
    profile 
  }: { 
    email: string; 
    password: string; 
    profile: any;
  }) => {
    const user = await authService.signUp(email, password, profile);
    return user;
  }
);

export const signOut = createAsyncThunk(
  'auth/signOut',
  async () => {
    await authService.signOut();
  }
);

export const checkAuthState = createAsyncThunk(
  'auth/checkAuthState',
  async () => {
    const user = await authService.getUserData();
    return user;
  }
);

export const clearStoredAuthData = createAsyncThunk(
  'auth/clearStoredAuthData',
  async () => {
    // This is a synchronous action, just return success
    return { success: true };
  }
);

// Auth state interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isOnboardingComplete: boolean;
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false, // Changed from true to false
  error: null,
  isOnboardingComplete: true, // Set to true so app can navigate after auth
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setOnboardingComplete: (state, action: PayloadAction<boolean>) => {
      state.isOnboardingComplete = action.payload;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      console.log('🔄 Redux: updateUserProfile action dispatched:', action.payload);
      if (state.user) {
        console.log('👤 Current user state:', state.user);
        // Handle nested profile updates properly
        if (action.payload.profile) {
          state.user.profile = { ...state.user.profile, ...action.payload.profile };
          console.log('✅ Updated user profile:', state.user.profile);
        }
        // Handle other direct user properties
        const { profile, ...otherUpdates } = action.payload;
        state.user = { ...state.user, ...otherUpdates };
        console.log('✅ Final user state:', state.user);
      } else {
        console.log('❌ No user in state to update');
      }
    },
    clearStoredAuthData: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      state.isOnboardingComplete = true;
    },
  },
  extraReducers: (builder) => {
    // Sign In
    builder
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Sign in failed';
      });

    // Sign Up
    builder
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Sign up failed';
      });

    // Sign Out
    builder
      .addCase(signOut.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Sign out failed';
      });

    // Check Auth State
    builder
      .addCase(checkAuthState.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthState.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(checkAuthState.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

// Export actions
export const {
  setUser,
  clearUser,
  setError,
  clearError,
  setLoading,
  setOnboardingComplete,
  updateUserProfile,
} = authSlice.actions;

// Export selectors
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectError = (state: { auth: AuthState }) => state.auth.error;
export const selectIsOnboardingComplete = (state: { auth: AuthState }) => state.auth.isOnboardingComplete;

export default authSlice.reducer;
