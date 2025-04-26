
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (type: 'LOGIN' | 'SIGNUP') => {
    try {
      setLoading(true);
      const { error } = type === 'LOGIN'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (error) throw error;

      if (type === 'LOGIN') {
        navigate('/');
        toast({
          title: "Welcome back! 🎉",
          description: "Ready to manage your home like a boss?",
        });
      } else {
        toast({
          title: "Welcome to MaidEasy! 🚀",
          description: "Your account has been created successfully.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Oops! Something went wrong",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-maideasy-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-maideasy-blue">
            Maid<span className="text-maideasy-green">Easy</span>
          </CardTitle>
          <CardDescription>
            Your Smart Home Sidekick — for Maids, Meals, and More! 🚀
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button 
                className="w-full bg-maideasy-blue hover:bg-maideasy-blue/90"
                onClick={() => handleAuth('LOGIN')}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </TabsContent>
            <TabsContent value="signup" className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button 
                className="w-full bg-maideasy-green hover:bg-maideasy-green/90"
                onClick={() => handleAuth('SIGNUP')}
                disabled={loading}
              >
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
