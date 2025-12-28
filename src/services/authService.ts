import apiClient from './api';

export const authService = {
  // Request OTP
  async requestOTP(email: string): Promise<any> {
    try {
      const response = await apiClient.post('/users/request-otp', {
        email,
      });
      return response.data;
    } catch (error: any) {
      throw {
        success: false,
        error: error.response?.data?.error || 'Failed to send OTP. Please try again.',
        attemptsRemaining: error.response?.data?.attemptsRemaining,
      };
    }
  },

  // Verify OTP
  async verifyOTP(email: string, otp: string): Promise<any> {
    try {
      const response = await apiClient.post('/users/verify-otp', {
        email,
        otp,
      });
      return response.data;
    } catch (error: any) {
      throw {
        success: false,
        error: error.response?.data?.error || 'Invalid OTP. Please try again.',
        attemptsRemaining: error.response?.data?.attemptsRemaining,
      };
    }
  },
};

