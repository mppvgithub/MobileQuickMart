import apiClient from './api';

export const productService = {
  // Get all categories
  async getCategories(): Promise<any> {
    try {
      const response = await apiClient.get('/products/categories');
      return response.data;
    } catch (error: any) {
      throw {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch categories. Please try again.',
      };
    }
  },

  // Get all products (with optional filters)
  async getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
  }): Promise<any> {
    try {
      const response = await apiClient.get('/products', { params });
      return response.data;
    } catch (error: any) {
      throw {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch products. Please try again.',
      };
    }
  },
};

