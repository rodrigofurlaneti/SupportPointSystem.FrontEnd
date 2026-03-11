import apiClient from './client';
import { LoginResponseSchema, type LoginRequest, type LoginResponse } from '../schemas/auth.schema';

export const authApi = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        console.log('Attempting login with CPF:', credentials.cpf);
    const response = await apiClient.post('api/auth/login', {
      cpf: credentials.cpf.replace(/\D/g, ''),
      password: credentials.password,
    });
    return LoginResponseSchema.parse(response.data);
  },
};
