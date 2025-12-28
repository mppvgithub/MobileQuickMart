import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthState, User } from '../../types';
import { tokenStorage } from '../../utils/tokenStorage';

// Load tokens from storage on app start
export const loadStoredTokens = createAsyncThunk(
  'auth/loadStoredTokens',
  async () => {
    const accessToken = await tokenStorage.getAccessToken();
    const refreshToken = await tokenStorage.getRefreshToken();
    return { accessToken, refreshToken };
  }
);

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true to check stored tokens
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      // Save tokens to storage
      tokenStorage.saveAccessToken(action.payload.accessToken);
      tokenStorage.saveRefreshToken(action.payload.refreshToken);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      // Clear tokens from storage
      tokenStorage.clearTokens();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadStoredTokens.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadStoredTokens.fulfilled, (state, action) => {
        const { accessToken, refreshToken } = action.payload;
        if (accessToken && refreshToken) {
          state.accessToken = accessToken;
          state.refreshToken = refreshToken;
          // Note: User data should be fetched from API if token exists
          // For now, we'll set isAuthenticated based on token presence
          state.isAuthenticated = true;
        } else {
          state.isAuthenticated = false;
        }
        state.isLoading = false;
      })
      .addCase(loadStoredTokens.rejected, (state) => {
        state.isAuthenticated = false;
        state.isLoading = false;
      });
  },
});

export const { setCredentials, setLoading, updateUser, logout } = authSlice.actions;
export default authSlice.reducer;

