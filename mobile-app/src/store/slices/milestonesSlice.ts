// Milestones Slice
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Milestone, UserMilestone } from '../../../shared/types';
import { calculateDaysSince, calculateNextMilestone, calculateAchievedMilestones } from '../../../shared/milestoneTypes';

// Async thunks (these would be implemented with actual API calls)
export const fetchMilestones = createAsyncThunk(
  'milestones/fetchMilestones',
  async () => {
    // This would call the milestones service
    return [] as UserMilestone[];
  }
);

export const addMilestone = createAsyncThunk(
  'milestones/addMilestone',
  async (milestone: Partial<UserMilestone>) => {
    // This would call the milestones service
    return milestone as UserMilestone;
  }
);

export const updateMilestone = createAsyncThunk(
  'milestones/updateMilestone',
  async (milestone: UserMilestone) => {
    // This would call the milestones service
    return milestone;
  }
);

export const deleteMilestone = createAsyncThunk(
  'milestones/deleteMilestone',
  async (milestoneId: string) => {
    // This would call the milestones service
    return milestoneId;
  }
);

// Milestones state interface
interface MilestonesState {
  milestones: UserMilestone[];
  currentDays: number;
  nextMilestone: Milestone | null;
  achievedMilestones: Milestone[];
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: MilestonesState = {
  milestones: [],
  currentDays: 0,
  nextMilestone: null,
  achievedMilestones: [],
  isLoading: false,
  error: null,
};

// Milestones slice
const milestonesSlice = createSlice({
  name: 'milestones',
  initialState,
  reducers: {
    setMilestones: (state, action: PayloadAction<UserMilestone[]>) => {
      state.milestones = action.payload;
    },
    addMilestoneToList: (state, action: PayloadAction<UserMilestone>) => {
      state.milestones.push(action.payload);
    },
    updateMilestoneInList: (state, action: PayloadAction<UserMilestone>) => {
      const index = state.milestones.findIndex(m => m.milestone.days === action.payload.milestone.days);
      if (index !== -1) {
        state.milestones[index] = action.payload;
      }
    },
    removeMilestoneFromList: (state, action: PayloadAction<string>) => {
      state.milestones = state.milestones.filter(m => m.milestone.days.toString() !== action.payload);
    },
    setCurrentDays: (state, action: PayloadAction<number>) => {
      state.currentDays = action.payload;
      // Recalculate milestones when days change
      state.nextMilestone = calculateNextMilestone(action.payload);
      state.achievedMilestones = calculateAchievedMilestones(action.payload);
    },
    setNextMilestone: (state, action: PayloadAction<Milestone | null>) => {
      state.nextMilestone = action.payload;
    },
    setAchievedMilestones: (state, action: PayloadAction<Milestone[]>) => {
      state.achievedMilestones = action.payload;
    },
    updateSobrietyDate: (state, action: PayloadAction<string>) => {
      const days = calculateDaysSince(action.payload);
      state.currentDays = days;
      state.nextMilestone = calculateNextMilestone(days);
      state.achievedMilestones = calculateAchievedMilestones(days);
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
    // Fetch Milestones
    builder
      .addCase(fetchMilestones.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMilestones.fulfilled, (state, action) => {
        state.isLoading = false;
        state.milestones = action.payload;
      })
      .addCase(fetchMilestones.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch milestones';
      });

    // Add Milestone
    builder
      .addCase(addMilestone.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addMilestone.fulfilled, (state, action) => {
        state.isLoading = false;
        state.milestones.push(action.payload);
      })
      .addCase(addMilestone.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add milestone';
      });

    // Update Milestone
    builder
      .addCase(updateMilestone.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateMilestone.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.milestones.findIndex(m => m.milestone.days === action.payload.milestone.days);
        if (index !== -1) {
          state.milestones[index] = action.payload;
        }
      })
      .addCase(updateMilestone.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update milestone';
      });

    // Delete Milestone
    builder
      .addCase(deleteMilestone.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteMilestone.fulfilled, (state, action) => {
        state.isLoading = false;
        state.milestones = state.milestones.filter(m => m.milestone.days.toString() !== action.payload);
      })
      .addCase(deleteMilestone.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete milestone';
      });
  },
});

// Export actions
export const {
  setMilestones,
  addMilestoneToList,
  updateMilestoneInList,
  removeMilestoneFromList,
  setCurrentDays,
  setNextMilestone,
  setAchievedMilestones,
  updateSobrietyDate,
  setError,
  clearError,
  setLoading,
} = milestonesSlice.actions;

// Export selectors
export const selectMilestones = (state: { milestones: MilestonesState }) => state.milestones.milestones;
export const selectCurrentDays = (state: { milestones: MilestonesState }) => state.milestones.currentDays;
export const selectNextMilestone = (state: { milestones: MilestonesState }) => state.milestones.nextMilestone;
export const selectAchievedMilestones = (state: { milestones: MilestonesState }) => state.milestones.achievedMilestones;
export const selectIsLoading = (state: { milestones: MilestonesState }) => state.milestones.isLoading;
export const selectError = (state: { milestones: MilestonesState }) => state.milestones.error;

export default milestonesSlice.reducer;
