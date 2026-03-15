import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LoginResponse } from '../schemas/auth.schema';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
    token: string | null;
    // CORREÇÃO AQUI: Adicionado 'COMPANYOWNER' ao tipo
    role: 'ADMIN' | 'SELLER' | 'COMPANYOWNER' | null;
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
            role: null,
            userId: null,
            sellerId: null,
            userName: null,
            isAuth: false,
            setAuth: (data) => {
                set({
                    token: data.token,
                    role: data.userRole, 
                    userId: data.userId,
                    sellerId: data.sellerId,
                    userName: data.sellerName || 'Usuário',
                    isAuth: true,
                });
            },
            logout: () =>
                set({
                    token: null,
                    role: null,
                    userId: null,
                    sellerId: null,
                    userName: null,
                    isAuth: false,
                }),
        }),
        { name: '@CheckVisit:session' }
    )
);