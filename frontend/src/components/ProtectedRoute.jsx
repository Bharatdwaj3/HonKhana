import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { protectedRoutes } from '../config/routeConfig';

const hasToken = () =>
  Boolean(localStorage.getItem('accessToken')) || document.cookie.includes('accessToken');

const ProtectedRoute = ({ path, children }) => {
  const { user, loading, error } = useSelector((state) => state.avatar);
  const requiredRole = protectedRoutes[path];

  // No token at all - definitely not logged in.
  if (!hasToken()) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Token exists but we haven't confirmed the user yet - wait, don't redirect.
  if (!user && !error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // fetchUser failed - treat as not logged in.
  if (!user && error) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Logged in, but wrong role for this route.
  if (requiredRole !== 'any' && !requiredRole.includes(user.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export default ProtectedRoute;
