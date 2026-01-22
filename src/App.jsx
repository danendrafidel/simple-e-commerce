import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './modules/auth/LoginPage';
import CustomerListPage from './modules/customers/CustomerListPage';
import CustomerDetailPage from './modules/customers/CustomerDetailPage';
import TransactionPage from './modules/transactions/TransactionPage';
import UserLayout from './modules/user/UserLayout';
import UserPurchasePage from './modules/user/UserPurchasePage';
import UserHistoryPage from './modules/user/UserHistoryPage';
import UserProfilePage from './modules/user/UserProfilePage';
import PackageListPage from './modules/packages/PackageListPage';
import { useAuth } from './modules/auth/AuthContext';

function AdminRoute({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return null;
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== 'admin') {
    return <Navigate to="/user" replace />;
  }
  return children;
}

function CustomerRoute({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return null;
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== 'customer') {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/user"
        element={
          <CustomerRoute>
            <UserLayout />
          </CustomerRoute>
        }
      >
        <Route index element={<Navigate to="/user/purchase" replace />} />
        <Route path="purchase" element={<UserPurchasePage />} />
        <Route path="history" element={<UserHistoryPage />} />
        <Route path="profile" element={<UserProfilePage />} />
      </Route>
      <Route
        path="/"
        element={
          <AdminRoute>
            <MainLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="/customers" replace />} />
        <Route path="customers" element={<CustomerListPage />} />
        <Route path="customers/:id" element={<CustomerDetailPage />} />
        <Route path="transactions" element={<TransactionPage />} />
        <Route path="packages" element={<PackageListPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

