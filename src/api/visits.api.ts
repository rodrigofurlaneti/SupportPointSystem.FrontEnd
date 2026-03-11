import apiClient from './client';
import type { CheckinRequest, CheckoutRequest, VisitHistoryResponse } from '../schemas/visit.schema';

export const visitsApi = {
  checkin: async (data: CheckinRequest): Promise<void> => {
    await apiClient.post('/visits/checkin', data);
  },

  checkout: async (data: CheckoutRequest): Promise<void> => {
    await apiClient.post('/visits/checkout', data);
  },

  getHistory: async (params: { page: number; pageSize: number }): Promise<VisitHistoryResponse> => {
    const res = await apiClient.get('/visits/history', { params });
    return res.data;
  },
};
