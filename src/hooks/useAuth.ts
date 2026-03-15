import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../stores/auth.store';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { apiErrorMessages } from '../components/ApiErrorHandler';

export function useLogin() {
    const setAuth = useAuthStore((s) => s.setAuth);
    const navigate = useNavigate();
    return useMutation({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            setAuth(data);
            const isAdminOrOwner =
                data.userRole === 'ADMIN' ||
                data.userRole === 'COMPANYOWNER' ||
                data.userRole === 'COMPANY_OWNER';
            navigate(isAdminOrOwner ? '/admin/dashboard' : '/seller/dashboard');
        },
        onError: (err: any) => {
            const code = err.response?.data?.code;
            const msg = apiErrorMessages[code] ?? err.response?.data?.message ?? 'Erro ao fazer login.';
            toast.error(msg);
        },
    });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return () => {
    logout();
    navigate('/');
  };
}
