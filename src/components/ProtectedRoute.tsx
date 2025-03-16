import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuth();

  if (!user || !token || user.role !== 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}