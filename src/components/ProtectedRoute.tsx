
import { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Wait while authentication is loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-maideasy-background">
        <div className="animate-pulse text-center">
          <h2 className="text-2xl font-medium text-maideasy-text-primary">Loading</h2>
          <p className="text-maideasy-text-secondary mt-2">Please wait...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
