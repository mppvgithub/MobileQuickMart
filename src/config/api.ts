import { Platform } from 'react-native';

// API Configuration
export const API_CONFIG = {
  BASE_URL: __DEV__
    ? Platform.OS === 'android'
      ? 'http://10.0.2.2:3000/api' // Android emulator localhost
      : 'http://localhost:3000/api' // iOS simulator/device localhost
    : 'https://your-production-api.com/api', // Production - Update this
  TIMEOUT: 30000, // 30 seconds
};

