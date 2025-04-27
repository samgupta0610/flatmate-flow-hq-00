
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Github, Mail, MessageCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (type: 'LOGIN' | 'SIGNUP') => {
    try {
      setLoading(true);
      setError(null);
      
      // Form validation
      if (!email || !password) {
        setError('Please enter both email and password');
        return;
      }
      
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      const { error } = type === 'LOGIN'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (error) throw error;

      if (type === 'LOGIN') {
        navigate('/');
        toast({
          title: "Login Successful! 🎉",
          description: "Welcome back to MaidEasy!",
        });
      } else {
        toast({
          title: "Welcome to MaidEasy! 🚀",
          description: "Your account has been created successfully.",
        });
      }
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Authentication error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'twitter' | 'github') => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      });

      if (error) throw error;
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Social login failed",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const renderAuthError = () => {
    if (!error) return null;
    
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-maideasy-background p-4">
      <Card className="w-full max-w-md shadow-lg animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-maideasy-blue">
            Maid<span className="text-maideasy-green">Easy</span>
          </CardTitle>
          <CardDescription className="text-lg">
            Your Smart Home Sidekick — for Maids, Meals, and More! 🚀
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="text-base py-2">Login</TabsTrigger>
              <TabsTrigger value="signup" className="text-base py-2">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              {renderAuthError()}
              
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white text-base h-12"
              />
              
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white text-base h-12"
              />
              
              <Button 
                className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white font-medium h-12 text-base"
                onClick={() => handleAuth('LOGIN')}
                disabled={loading}
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Logging in...
                  </>
                ) : "Login"}
              </Button>
              
              <div className="relative my-6">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                  OR CONTINUE WITH
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin('google')}
                  disabled={loading}
                  className="w-full h-11 border-gray-300 hover:bg-gray-50"
                >
                  <Mail className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin('twitter')}
                  disabled={loading}
                  className="w-full h-11 border-gray-300 hover:bg-gray-50"
                >
                  <MessageCircle className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin('github')}
                  disabled={loading}
                  className="w-full h-11 border-gray-300 hover:bg-gray-50"
                >
                  <Github className="h-5 w-5" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              {renderAuthError()}
              
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white text-base h-12"
              />
              
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white text-base h-12"
              />
              
              <Button 
                className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white font-medium h-12 text-base"
                onClick={() => handleAuth('SIGNUP')}
                disabled={loading}
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Creating account...
                  </>
                ) : "Sign Up"}
              </Button>
              
              <div className="relative my-6">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
                  OR CONTINUE WITH
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin('google')}
                  disabled={loading}
                  className="w-full h-11 border-gray-300 hover:bg-gray-50"
                >
                  <Mail className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin('twitter')}
                  disabled={loading}
                  className="w-full h-11 border-gray-300 hover:bg-gray-50"
                >
                  <MessageCircle className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin('github')}
                  disabled={loading}
                  className="w-full h-11 border-gray-300 hover:bg-gray-50"
                >
                  <Github className="h-5 w-5" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
