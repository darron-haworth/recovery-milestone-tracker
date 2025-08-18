// Friends Slice
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Friend } from '../../../shared/types';

// Async thunks (these would be implemented with actual API calls)
export const fetchFriends = createAsyncThunk(
  'friends/fetchFriends',
  async () => {
    // This would call the friends service
    return [] as Friend[];
  }
);

export const addFriend = createAsyncThunk(
  'friends/addFriend',
  async (friend: Partial<Friend>) => {
    // This would call the friends service
    return friend as Friend;
  }
);

export const removeFriend = createAsyncThunk(
  'friends/removeFriend',
  async (friendId: string) => {
    // This would call the friends service
    return friendId;
  }
);

// Friends state interface
interface FriendsState {
  friends: Friend[];
  pendingRequests: Friend[];
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: FriendsState = {
  friends: [],
  pendingRequests: [],
  isLoading: false,
  error: null,
};

// Friends slice
const friendsSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    setFriends: (state, action: PayloadAction<Friend[]>) => {
      state.friends = action.payload;
    },
    addFriendToList: (state, action: PayloadAction<Friend>) => {
      state.friends.push(action.payload);
    },
    removeFriendFromList: (state, action: PayloadAction<string>) => {
      state.friends = state.friends.filter(friend => friend.friendId !== action.payload);
    },
    updateFriend: (state, action: PayloadAction<Friend>) => {
      const index = state.friends.findIndex(friend => friend.friendId === action.payload.friendId);
      if (index !== -1) {
        state.friends[index] = action.payload;
      }
    },
    setPendingRequests: (state, action: PayloadAction<Friend[]>) => {
      state.pendingRequests = action.payload;
    },
    addPendingRequest: (state, action: PayloadAction<Friend>) => {
      state.pendingRequests.push(action.payload);
    },
    removePendingRequest: (state, action: PayloadAction<string>) => {
      state.pendingRequests = state.pendingRequests.filter(
        request => request.friendId !== action.payload
      );
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
    // Fetch Friends
    builder
      .addCase(fetchFriends.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.isLoading = false;
        state.friends = action.payload;
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch friends';
      });

    // Add Friend
    builder
      .addCase(addFriend.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addFriend.fulfilled, (state, action) => {
        state.isLoading = false;
        state.friends.push(action.payload);
      })
      .addCase(addFriend.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add friend';
      });

    // Remove Friend
    builder
      .addCase(removeFriend.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFriend.fulfilled, (state, action) => {
        state.isLoading = false;
        state.friends = state.friends.filter(friend => friend.friendId !== action.payload);
      })
      .addCase(removeFriend.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to remove friend';
      });
  },
});

// Export actions
export const {
  setFriends,
  addFriendToList,
  removeFriendFromList,
  updateFriend,
  setPendingRequests,
  addPendingRequest,
  removePendingRequest,
  setError,
  clearError,
  setLoading,
} = friendsSlice.actions;

// Export selectors
export const selectFriends = (state: { friends: FriendsState }) => state.friends.friends;
export const selectPendingRequests = (state: { friends: FriendsState }) => state.friends.pendingRequests;
export const selectIsLoading = (state: { friends: FriendsState }) => state.friends.isLoading;
export const selectError = (state: { friends: FriendsState }) => state.friends.error;

export default friendsSlice.reducer;
