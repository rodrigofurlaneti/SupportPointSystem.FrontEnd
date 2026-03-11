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
        {/* Public */}
        <Route path="/" element={<LoginPage />} />

        {/* Seller routes */}
        <Route
          path="/seller/dashboard"
          element={
            <AuthGuard requiredRole="SELLER">
              <SellerDashboard />
            </AuthGuard>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AuthGuard requiredRole="ADMIN">
              <AdminDashboard />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/sellers/list"
          element={
            <AuthGuard requiredRole="ADMIN">
              <AdminSellerList />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/sellers/new"
          element={
            <AuthGuard requiredRole="ADMIN">
              <AdminSellerCreate />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/sellers/edit/:id"
          element={
            <AuthGuard requiredRole="ADMIN">
              <AdminSellerEdit />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/customers/list"
          element={
            <AuthGuard requiredRole="ADMIN">
              <AdminCustomerList />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/customers/new"
          element={
            <AuthGuard requiredRole="ADMIN">
              <AdminCustomerCreate />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/customers/edit/:id"
          element={
            <AuthGuard requiredRole="ADMIN">
              <AdminCustomerEdit />
            </AuthGuard>
          }
        />
        <Route
          path="/admin/visits/history"
          element={
            <AuthGuard requiredRole="ADMIN">
              <AdminVisitHistory />
            </AuthGuard>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
