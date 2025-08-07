
import { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { useProfile } from '@/hooks/useProfile';
import { Loader2 } from 'lucide-react';
import HouseGroupOnboarding from './HouseGroupOnboarding';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  // TEMPORARY: Skip authentication checks for testing
  return <>{children}</>;

  // ORIGINAL CODE COMMENTED OUT FOR RESTORATION:
  /*
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  
  // Wait while authentication is loading
  if (authLoading || profileLoading) {
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

  // If authenticated but no house group, show onboarding
  if (profile && !profile.house_group_id) {
    return (
      <HouseGroupOnboarding 
        onComplete={() => window.location.reload()} 
      />
    );
  }

  // If authenticated and has house group, render the protected content
  return <>{children}</>;
  */
};

export default ProtectedRoute;
