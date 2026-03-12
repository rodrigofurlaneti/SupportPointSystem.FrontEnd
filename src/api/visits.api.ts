import apiClient from './client';
import type { CheckinRequest, CheckoutRequest, VisitHistoryResponse } from '../schemas/visit.schema';

export const visitsApi = {
  checkin: async (data: CheckinRequest): Promise<void> => {
    console.log("DADOS QUE ESTÃO SAINDO DO FRONT:", data);
    await apiClient.post('api/visits/checkin', data);
  },

  checkout: async (data: CheckoutRequest): Promise<void> => {
    await apiClient.post('api/visits/checkout', data);
  },

    getHistory: async (params: { page: number; pageSize: number; sellerId?: string }): Promise<VisitHistoryResponse> => {
        const cleanParams = Object.fromEntries(
            Object.entries(params).filter(([_, v]) => v !== undefined)
        );
        const res = await apiClient.get('api/visits/history', { params: cleanParams });
        return res.data; 
    },
};
