import apiClient from './client';
import type { CreateSeller, Seller } from '../schemas/seller.schema';

export const sellersApi = {
    getAll: async (): Promise<Seller[]> => {
        const res = await apiClient.get<Seller[]>('api/sellers');
        return res.data;
    },

    getById: async (id: string): Promise<Seller> => {
        // Note: O 'id' aqui é o parâmetro da URL, mas o retorno terá 'sellerId'
        const res = await apiClient.get<Seller>(`api/sellers/${id}`);
        return res.data;
    },

    create: async (data: CreateSeller): Promise<Seller> => {
        const res = await apiClient.post<Seller>('api/sellers', data);
        return res.data;
    },

    // Ajustado para garantir que o 'id' da URL e o corpo da requisição estejam alinhados
    update: async (id: string, data: Partial<CreateSeller>): Promise<Seller> => {
        const res = await apiClient.put<Seller>(`api/sellers/${id}`, data);
        return res.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`api/sellers/${id}`);
    },
};