import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthGuard } from './components/AuthGuard';
import LoginPage from './pages/Login/LoginPage';
import SellerDashboard from './pages/Dashboard/SellerDashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import AdminSellerList from './pages/Admin/Seller/AdminSellerList';
import AdminSellerCreate from './pages/Admin/Seller/AdminSellerCreate';
import AdminSellerEdit from './pages/Admin/Seller/AdminSellerEdit';
import AdminCustomerList from './pages/Admin/Customer/AdminCustomerList';
import AdminCustomerCreate from './pages/Admin/Customer/AdminCustomerCreate';
import AdminCustomerEdit from './pages/Admin/Customer/AdminCustomerEdit';
import AdminVisitHistory from './pages/Admin/AdminVisitHistory';

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Pública */}
                <Route path="/" element={<LoginPage />} />

                {/* Rotas de Vendedor */}
                <Route
                    path="/seller/dashboard"
                    element={
                        <AuthGuard requiredRole="SELLER">
                            <SellerDashboard />
                        </AuthGuard>
                    }
                />

                {/* Rotas Administrativas (Abertas para ADMIN e COMPANYOWNER) */}
                <Route
                    path="/admin/dashboard"
                    element={
                        <AuthGuard>
                            <AdminDashboard />
                        </AuthGuard>
                    }
                />

                <Route
                    path="/admin/sellers/list"
                    element={
                        <AuthGuard>
                            <AdminSellerList />
                        </AuthGuard>
                    }
                />

                <Route
                    path="/admin/sellers/new"
                    element={
                        <AuthGuard>
                            <AdminSellerCreate />
                        </AuthGuard>
                    }
                />

                <Route
                    path="/admin/sellers/edit/:id"
                    element={
                        <AuthGuard>
                            <AdminSellerEdit />
                        </AuthGuard>
                    }
                />

                <Route
                    path="/admin/customers/list"
                    element={
                        <AuthGuard>
                            <AdminCustomerList />
                        </AuthGuard>
                    }
                />

                <Route
                    path="/admin/customers/new"
                    element={
                        <AuthGuard>
                            <AdminCustomerCreate />
                        </AuthGuard>
                    }
                />

                <Route
                    path="/admin/customers/edit/:id"
                    element={
                        <AuthGuard>
                            <AdminCustomerEdit />
                        </AuthGuard>
                    }
                />

                <Route
                    path="/admin/visits/history"
                    element={
                        <AuthGuard>
                            <AdminVisitHistory />
                        </AuthGuard>
                    }
                />

                {/* Fallback para evitar 404 e tela branca */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}