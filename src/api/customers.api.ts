import apiClient from './client';
import type { Customer, UpsertCustomer } from '../schemas/customer.schema';

export const customersApi = {
  getAll: async (): Promise<Customer[]> => {
    const res = await apiClient.get('api/customers');
    return res.data;
  },

  getById: async (id: string): Promise<Customer> => {
    const res = await apiClient.get(`api/customers/${id}`);
    return res.data;
  },

  upsert: async (data: UpsertCustomer): Promise<Customer> => {
    const res = await apiClient.post('api/customers', data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`api/customers/${id}`);
  },
};
