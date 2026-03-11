import apiClient from './client';
import type { CreateSeller, Seller } from '../schemas/seller.schema';

export const sellersApi = {
  getAll: async (): Promise<Seller[]> => {
    const res = await apiClient.get('/sellers');
    return res.data;
  },

  getById: async (id: string): Promise<Seller> => {
    const res = await apiClient.get(`/sellers/${id}`);
    return res.data;
  },

  create: async (data: CreateSeller): Promise<Seller> => {
    const res = await apiClient.post('/sellers', data);
    return res.data;
  },

  update: async (id: string, data: Partial<CreateSeller>): Promise<Seller> => {
    const res = await apiClient.put(`/sellers/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/sellers/${id}`);
  },
};
