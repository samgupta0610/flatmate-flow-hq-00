
import { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Wait while authentication is loading
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-maideasy-background">
        <Loader2 className="h-10 w-10 text-maideasy-primary animate-spin mb-4" />
        <h2 className="text-2xl font-medium text-maideasy-text-primary">Loading</h2>
        <p className="text-maideasy-text-secondary mt-2">Please wait while we verify your session...</p>
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
