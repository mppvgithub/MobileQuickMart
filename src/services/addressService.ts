import apiClient from './api';

export const addressService = {
  // Get all addresses
  async getAllAddresses(): Promise<any> {
    try {
      const response = await apiClient.get('/addresses');
      return response.data;
    } catch (error: any) {
      throw {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch addresses. Please try again.',
      };
    }
  },

  // Get address by ID
  async getAddressById(id: string): Promise<any> {
    try {
      const response = await apiClient.get(`/addresses/${id}`);
      return response.data;
    } catch (error: any) {
      throw {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch address. Please try again.',
      };
    }
  },

  // Create address
  async createAddress(addressData: {
    addressLine1: string;
    addressLine2?: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
    addressType?: 'Home' | 'Work' | 'Other';
    contactName: string;
    contactPhone: string;
    latitude?: number;
    longitude?: number;
    isDefault?: boolean;
  }): Promise<any> {
    try {
      const response = await apiClient.post('/addresses', addressData);
      return response.data;
    } catch (error: any) {
      throw {
        success: false,
        error: error.response?.data?.error || 'Failed to create address. Please try again.',
      };
    }
  },

  // Update address
  async updateAddress(id: string, addressData: any): Promise<any> {
    try {
      const response = await apiClient.put(`/addresses/${id}`, addressData);
      return response.data;
    } catch (error: any) {
      throw {
        success: false,
        error: error.response?.data?.error || 'Failed to update address. Please try again.',
      };
    }
  },

  // Delete address
  async deleteAddress(id: string): Promise<any> {
    try {
      const response = await apiClient.delete(`/addresses/${id}`);
      return response.data;
    } catch (error: any) {
      throw {
        success: false,
        error: error.response?.data?.error || 'Failed to delete address. Please try again.',
      };
    }
  },

  // Set default address
  async setDefaultAddress(id: string): Promise<any> {
    try {
      const response = await apiClient.put(`/addresses/${id}/set-default`);
      return response.data;
    } catch (error: any) {
      throw {
        success: false,
        error: error.response?.data?.error || 'Failed to set default address. Please try again.',
      };
    }
  },
};

