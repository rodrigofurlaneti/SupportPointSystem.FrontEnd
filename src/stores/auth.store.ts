import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LoginResponse } from '../schemas/auth.schema';

interface AuthState {
    token: string | null;
    // Padronizado como userRole para bater com a API e o Schema
    userRole: 'ADMIN' | 'SELLER' | 'COMPANYOWNER' | 'COMPANY_OWNER' | null;
    userId: string | null;
    sellerId: string | null;
    userName: string | null;
    isAuth: boolean;
    setAuth: (data: LoginResponse) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            userRole: null, // Inicializado como null
            userId: null,
            sellerId: null,
            userName: null,
            isAuth: false,

            setAuth: (data: LoginResponse) => {
                set({
                    token: data.token,
                    // Atribuição direta: userRole (Store) recebe userRole (API)
                    userRole: data.userRole,
                    userId: data.userId,
                    sellerId: data.sellerId,
                    userName: data.sellerName || 'Usuário',
                    isAuth: true,
                });
            },

            logout: () =>
                set({
                    token: null,
                    userRole: null,
                    userId: null,
                    sellerId: null,
                    userName: null,
                    isAuth: false,
                }),
        }),
        {
            name: '@CheckVisit:session',
            // Padrão é localStorage
        }
    )
);