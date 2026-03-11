import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LoginResponse } from '../schemas/auth.schema';

interface AuthState {
  token: string | null;
  role: 'ADMIN' | 'SELLER' | null;
  userId: string | null;
  sellerId: string | null;
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
      isAuth: false,
      setAuth: (data) =>
        set({
          token: data.token,
          role: data.userRole,
          userId: data.userId,
          sellerId: data.sellerId,
          isAuth: true,
        }),
      logout: () =>
        set({
          token: null,
          role: null,
          userId: null,
          sellerId: null,
          isAuth: false,
        }),
    }),
    { name: '@CheckVisit:session' }
  )
);
