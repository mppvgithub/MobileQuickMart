// Type definitions for the app

export interface User {
  _id: string;
  email: string;
  fullName?: string;
  phone?: string;
  isProfileComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface RootState {
  auth: AuthState;
  // Add other slices here as needed
}

