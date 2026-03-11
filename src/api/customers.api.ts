import apiClient from './client';
import type { Customer, UpsertCustomer } from '../schemas/customer.schema';

export const customersApi = {
  getAll: async (): Promise<Customer[]> => {
    const res = await apiClient.get('/customers');
    return res.data;
  },

  getById: async (id: string): Promise<Customer> => {
    const res = await apiClient.get(`/customers/${id}`);
    return res.data;
  },

  upsert: async (data: UpsertCustomer): Promise<Customer> => {
    const res = await apiClient.post('/customers', data);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/customers/${id}`);
  },
};
