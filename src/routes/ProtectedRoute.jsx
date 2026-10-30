import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * ProtectedRoute: Enforces authentication and role-based permissions.
 * @param {{ children: React.ReactNode, allowedRoles?: string[] }} props
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, role, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !currentUser) {
    // Redirect unauthenticated user to login with return path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required, verify access
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect unauthorized user to their respective dashboard
    if (role === 'admin') return <Navigate to="/admin" replace />;
    if (role === 'restaurant') return <Navigate to="/restaurant" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}

