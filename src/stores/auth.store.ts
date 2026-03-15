import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LoginResponse } from '../schemas/auth.schema';

interface AuthState {
    token: string | null;
    userRole: 'ADMIN' | 'SELLER' | 'COMPANYOWNER' | 'COMPANY_OWNER' | null;
    userId: string | null;
    companyId: string | null;
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
            userRole: null,
            userId: null,
            companyId: null, 
            sellerId: null,
            userName: null,
            isAuth: false,

            setAuth: (data: LoginResponse) => {
                set({
                    token: data.token,
                    userRole: data.userRole,
                    userId: data.userId,
                    companyId: data.companyId || null,
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
                    companyId: null, 
                    sellerId: null,
                    userName: null,
                    isAuth: false,
                }),
        }),
        {
            name: '@CheckVisit:session',
        }
    )
);