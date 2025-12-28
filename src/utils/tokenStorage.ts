import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEYS = {
  ACCESS_TOKEN: '@QuickMart:accessToken',
  REFRESH_TOKEN: '@QuickMart:refreshToken',
};

export const tokenStorage = {
  // Save access token
  async saveAccessToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, token);
    } catch (error) {
      console.error('Error saving access token:', error);
      throw error;
    }
  },

  // Get access token
  async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  },

  // Save refresh token
  async saveRefreshToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, token);
    } catch (error) {
      console.error('Error saving refresh token:', error);
      throw error;
    }
  },

  // Get refresh token
  async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  },

  // Clear all tokens
  async clearTokens(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        TOKEN_KEYS.ACCESS_TOKEN,
        TOKEN_KEYS.REFRESH_TOKEN,
      ]);
    } catch (error) {
      console.error('Error clearing tokens:', error);
      throw error;
    }
  },

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAccessToken();
    return token !== null;
  },
};

