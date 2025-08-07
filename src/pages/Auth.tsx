
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Auth = () => {
  const navigate = useNavigate();

  // TEMPORARY: Redirect to dashboard since auth is disabled for testing
  React.useEffect(() => {
    navigate('/', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-maideasy-background p-4">
      <Card className="w-full max-w-md shadow-lg animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-maideasy-blue">
            Testing Mode
          </CardTitle>
          <CardDescription className="text-lg">
            Authentication is disabled for LLM testing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => navigate('/')} 
            className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white font-medium h-12 text-base"
          >
            Continue to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
