import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  Stack,
  CircularProgress,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  Person as UserIcon,
  ArrowForward as ArrowRightIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleGuestAccess = () => {
    // Store guest mode in localStorage and navigate to dashboard
    localStorage.setItem('guestMode', 'true');
    navigate('/', { replace: true });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast({
            title: "Account exists",
            description: "This email is already registered. Please sign in instead.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Account created successfully! ✅",
          description: "You can now sign in to your account.",
        });
        // Auto-signin after successful signup for faster onboarding
        setTimeout(() => {
          handleSignIn(e);
        }, 1000);
      }
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Sign in failed",
            description: "Invalid email or password. Please check your credentials.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      }
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
            borderRadius: 4,
          }}
        >
          <CardHeader sx={{ textAlign: 'center', pb: 2 }}>
            <Typography
              variant="h3"
              component="h1"
              fontWeight="bold"
              color="primary.main"
              gutterBottom
            >
              MaidEasy
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Your household management companion
            </Typography>
          </CardHeader>
          
          <CardContent sx={{ px: 4, pb: 4 }}>
            <Box sx={{ mb: 3 }}>
              <Tabs
                value={tabValue}
                onChange={(_, newValue) => setTabValue(newValue)}
                variant="fullWidth"
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '1rem',
                  },
                }}
              >
                <Tab label="Sign In" />
                <Tab label="Sign Up" />
              </Tabs>
            </Box>

            {tabValue === 0 && (
              <Box component="form" onSubmit={handleSignIn}>
                <Stack spacing={3}>
                  <TextField
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    fullWidth
                    size="large"
                    sx={{
                      background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      },
                    }}
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </Stack>
              </Box>
            )}

            {tabValue === 1 && (
              <Box component="form" onSubmit={handleSignUp}>
                <Stack spacing={3}>
                  <TextField
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    fullWidth
                    size="large"
                    sx={{
                      background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      },
                    }}
                  >
                    {loading ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Creating account...
                      </>
                    ) : (
                      'Sign Up'
                    )}
                  </Button>
                </Stack>
              </Box>
            )}

            {/* Guest Access Option */}
            <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
              <Stack spacing={2} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Want to explore first?
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleGuestAccess}
                  startIcon={<UserIcon />}
                  endIcon={<ArrowRightIcon />}
                  fullWidth
                  sx={{
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  Continue as Guest
                </Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Auth;