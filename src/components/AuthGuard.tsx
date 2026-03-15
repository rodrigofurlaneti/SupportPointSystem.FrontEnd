import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';

interface Props {
    children: React.ReactNode;
    requiredRole?: 'ADMIN' | 'SELLER' | 'COMPANYOWNER' | 'COMPANY_OWNER';
}

export function AuthGuard({ children, requiredRole }: Props) {
    const { isAuth, userRole } = useAuthStore();
    if (!isAuth) {
        return <Navigate to="/" replace />;
    }
    if (requiredRole && userRole !== requiredRole) {
        let fallbackPath = '/';
        const isAdminOrOwner =
            userRole === 'ADMIN' ||
            userRole === 'COMPANYOWNER' ||
            userRole === 'COMPANY_OWNER';
        if (isAdminOrOwner) {
            fallbackPath = '/admin/dashboard';
        } else if (userRole === 'SELLER') {
            fallbackPath = '/seller/dashboard';
        }
        return <Navigate to={fallbackPath} replace />;
    }
    return <>{children}</>;
}