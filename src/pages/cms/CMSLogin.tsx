import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Lock, UserPlus } from 'lucide-react';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const CMSLogin = () => {
  const navigate = useNavigate();
  const { user, isCmsUser, isLoading, signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [success, setSuccess] = useState('');

  // Redirect if already authenticated with CMS access
  useEffect(() => {
    if (!isLoading && user && isCmsUser) {
      navigate('/rat-control/cms/dashboard');
    }
  }, [user, isCmsUser, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    // Validate input
    const validation = authSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      setIsSubmitting(false);
      return;
    }

    try {
      if (isSignUp) {
        const { error: signUpError } = await signUp(email, password);
        if (signUpError) {
          if (signUpError.message.includes('already registered')) {
            setError('An account with this email already exists. Please sign in instead.');
          } else {
            setError(signUpError.message);
          }
        } else {
          setSuccess('Account created! Please contact an administrator to grant you CMS access.');
          setEmail('');
          setPassword('');
        }
      } else {
        const { error: signInError } = await signIn(email, password);
        if (signInError) {
          if (signInError.message.includes('Invalid login credentials')) {
            setError('Invalid email or password');
          } else {
            setError(signInError.message);
          }
        }
        // Navigation will happen via useEffect when isCmsUser is true
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }

    setIsSubmitting(false);
  };

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show access denied if logged in but not a CMS user
  if (user && !isCmsUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-destructive/10 mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            Your account does not have permission to access the CMS. 
            Please contact an administrator to request access.
          </p>
          <Button
            variant="outline"
            onClick={async () => {
              const { signOut } = useAuth();
              await signOut();
              navigate('/rat-control/cms/admin');
            }}
          >
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Mamdani Tracker</h1>
          <p className="text-muted-foreground mt-1">Content Management System</p>
        </div>

        {/* Login Card */}
        <div className="cms-card p-6">
          <div className="flex gap-2 mb-6">
            <Button
              type="button"
              variant={!isSignUp ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => {
                setIsSignUp(false);
                setError('');
                setSuccess('');
              }}
            >
              Sign In
            </Button>
            <Button
              type="button"
              variant={isSignUp ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => {
                setIsSignUp(true);
                setError('');
                setSuccess('');
              }}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Sign Up
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="cms-input-label">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="cms-input-label">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                className="h-11"
                required
              />
              {isSignUp && (
                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm p-3 bg-destructive/10 rounded-md">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 text-primary text-sm p-3 bg-primary/10 rounded-md">
                <span>{success}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11"
              disabled={isSubmitting}
            >
              {isSubmitting ? (isSignUp ? 'Creating account...' : 'Signing in...') : (isSignUp ? 'Create Account' : 'Sign in')}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          {isSignUp 
            ? 'After signing up, an administrator must grant you CMS access'
            : 'Authorized personnel only'
          }
        </p>
      </div>
    </div>
  );
};

export default CMSLogin;
