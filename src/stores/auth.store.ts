import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LoginResponse } from '../schemas/auth.schema';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
    token: string | null;
    role: 'ADMIN' | 'SELLER' | null;
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
                const decoded: any = jwtDecode(data.token);
                set({
                    token: data.token,
                    role: data.userRole,
                    userId: data.userId,
                    sellerId: data.sellerId,
                    userName: decoded.sellerName || 'Usuário', // Pega o nome de dentro do JWT
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
