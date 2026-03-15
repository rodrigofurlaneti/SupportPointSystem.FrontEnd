import { z } from 'zod'; // ADICIONE ESTA LINHA NO TOPO
import apiClient from './client';
import {
    LoginResponseSchema,
    RegisterCompanyResponseSchema,
    type RegisterCompanyResponse,
    type RegisterCompanyRequest,
    type LoginRequest,
    type LoginResponse
} from '../schemas/auth.schema';

export const authApi = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        try {
            const response = await apiClient.post('api/auth/login', credentials);
            return LoginResponseSchema.parse(response.data);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                console.error("ERRO DE VALIDAÇÃO DO ZOD:", error.errors);
            }
            throw error;
        }
    },

    register: async (data: RegisterCompanyRequest): Promise<RegisterCompanyResponse> => {
        const response = await apiClient.post('api/auth/register', data);
        return RegisterCompanyResponseSchema.parse(response.data);
    }
};