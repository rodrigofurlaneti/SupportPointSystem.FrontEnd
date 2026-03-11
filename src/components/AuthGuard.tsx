import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';

interface Props {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'SELLER';
}

export function AuthGuard({ children, requiredRole }: Props) {
  const { isAuth, role } = useAuthStore();

  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return (
      <Navigate
        to={role === 'ADMIN' ? '/admin/dashboard' : '/seller/dashboard'}
        replace
      />
    );
  }

  return <>{children}</>;
}
