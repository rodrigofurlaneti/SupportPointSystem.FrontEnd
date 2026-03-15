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
        const response = await apiClient.post('api/auth/login', credentials);
        return LoginResponseSchema.parse(response.data);
    },

    register: async (data: RegisterCompanyRequest): Promise<RegisterCompanyResponse> => {
        const response = await apiClient.post('api/auth/register', data);
        return RegisterCompanyResponseSchema.parse(response.data);
    }
};