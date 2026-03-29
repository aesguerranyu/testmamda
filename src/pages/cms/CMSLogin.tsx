import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Lock, ShieldCheck, Copy, Check } from 'lucide-react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { QRCodeSVG } from 'qrcode.react';
import { logError } from '@/lib/logger';

const authSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginStep = 'credentials' | 'totp-verify' | 'totp-setup';

const CMSLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isCmsUser, isLoading, signIn, signOut } = useAuth();
  const returnTo = searchParams.get('returnTo');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 2FA state
  const [step, setStep] = useState<LoginStep>('credentials');
  const [totpCode, setTotpCode] = useState('');
  const [totpSecret, setTotpSecret] = useState('');
  const [otpauthUri, setOtpauthUri] = useState('');
  const [secretCopied, setSecretCopied] = useState(false);
  const [totpVerified, setTotpVerified] = useState(false);

  // After successful password auth + 2FA verification, redirect
  useEffect(() => {
    if (!isLoading && user && isCmsUser && totpVerified) {
      if (returnTo && returnTo.includes('/ratify')) {
        navigate(decodeURIComponent(returnTo), { replace: true });
      } else {
        navigate('/rat-control/cms/dashboard', { replace: true });
      }
    }
  }, [user, isCmsUser, isLoading, totpVerified, navigate, returnTo]);

  // After password login succeeds, check TOTP status
  const checkTotpStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await supabase.functions.invoke('totp-status', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (res.error) {
        logError('TOTP status check failed', res.error);
        // If TOTP check fails, sign out and show error
        await signOut();
        setError('Failed to verify 2FA status. Please try again.');
        setStep('credentials');
        return;
      }

      const { has_totp, is_enabled } = res.data;
      if (has_totp && is_enabled) {
        setStep('totp-verify');
      } else {
        // User needs to set up TOTP
        await setupTotp(session.access_token);
      }
    } catch (err) {
      logError('TOTP status error', err);
      await signOut();
      setError('An error occurred. Please try again.');
      setStep('credentials');
    }
  };

  const setupTotp = async (accessToken: string) => {
    try {
      const res = await supabase.functions.invoke('totp-setup', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.error || !res.data?.secret) {
        setError('Failed to initialize 2FA setup. Please try again.');
        await signOut();
        setStep('credentials');
        return;
      }

      setTotpSecret(res.data.secret);
      setOtpauthUri(res.data.otpauth_uri);
      setStep('totp-setup');
    } catch (err) {
      logError('TOTP setup error', err);
      setError('Failed to set up 2FA. Please try again.');
      await signOut();
      setStep('credentials');
    }
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const validation = authSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      setIsSubmitting(false);
      return;
    }

    try {
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password');
        } else {
          setError(signInError.message);
        }
        setIsSubmitting(false);
        return;
      }

      // Password auth succeeded, now check TOTP
      await checkTotpStatus();
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }

    setIsSubmitting(false);
  };

  const handleTotpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Session expired. Please sign in again.');
        setStep('credentials');
        setIsSubmitting(false);
        return;
      }

      const res = await supabase.functions.invoke('totp-verify', {
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: { code: totpCode, enable: step === 'totp-setup' },
      });

      if (res.error) {
        setError('Verification failed. Please try again.');
        setIsSubmitting(false);
        return;
      }

      if (res.data?.valid) {
        setTotpVerified(true);
        // Redirect will happen via useEffect
      } else {
        setError('Invalid code. Please try again.');
        setTotpCode('');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    }

    setIsSubmitting(false);
  };

  const copySecret = () => {
    navigator.clipboard.writeText(totpSecret);
    setSecretCopied(true);
    setTimeout(() => setSecretCopied(false), 2000);
  };

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show access denied if logged in but not a CMS user (and not in a 2FA flow)
  if (user && !isCmsUser && step === 'credentials') {
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
              await signOut();
              setStep('credentials');
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
            {step === 'credentials' ? (
              <Lock className="w-8 h-8 text-primary" />
            ) : (
              <ShieldCheck className="w-8 h-8 text-primary" />
            )}
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Mamdani Tracker</h1>
          <p className="text-muted-foreground mt-1">
            {step === 'credentials' && 'Content Management System'}
            {step === 'totp-verify' && 'Two-Factor Authentication'}
            {step === 'totp-setup' && 'Set Up Two-Factor Authentication'}
          </p>
        </div>

        {/* Login Card */}
        <div className="cms-card p-6">
          {step === 'credentials' && (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="cms-input-label">Email</Label>
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
                <Label htmlFor="password" className="cms-input-label">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="h-11"
                  required
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm p-3 bg-destructive/10 rounded-md">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          )}

          {step === 'totp-setup' && (
            <div className="space-y-5">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Scan the QR code below with your authenticator app (Google Authenticator, Authy, etc.)
                </p>
                <div className="inline-block p-4 bg-white rounded-lg">
                  <QRCodeSVG value={otpauthUri} size={200} />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Or enter this key manually:
                </Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs bg-muted p-2 rounded font-mono break-all">
                    {totpSecret}
                  </code>
                  <Button variant="outline" size="sm" onClick={copySecret}>
                    {secretCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <form onSubmit={handleTotpVerify} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="totp-code" className="cms-input-label">
                    Enter the 6-digit code from your app
                  </Label>
                  <Input
                    id="totp-code"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="000000"
                    className="h-11 text-center text-lg tracking-widest font-mono"
                    autoFocus
                    required
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-destructive text-sm p-3 bg-destructive/10 rounded-md">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <Button type="submit" className="w-full h-11" disabled={isSubmitting || totpCode.length !== 6}>
                  {isSubmitting ? 'Verifying...' : 'Verify & Enable 2FA'}
                </Button>
              </form>

              <Button
                variant="ghost"
                className="w-full text-xs"
                onClick={async () => {
                  await signOut();
                  setStep('credentials');
                  setTotpCode('');
                  setError('');
                }}
              >
                Cancel and sign out
              </Button>
            </div>
          )}

          {step === 'totp-verify' && (
            <form onSubmit={handleTotpVerify} className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Enter the 6-digit code from your authenticator app
              </p>
              <div className="space-y-2">
                <Input
                  id="totp-verify-code"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="h-11 text-center text-lg tracking-widest font-mono"
                  autoFocus
                  required
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm p-3 bg-destructive/10 rounded-md">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" className="w-full h-11" disabled={isSubmitting || totpCode.length !== 6}>
                {isSubmitting ? 'Verifying...' : 'Verify'}
              </Button>

              <Button
                variant="ghost"
                className="w-full text-xs"
                onClick={async () => {
                  await signOut();
                  setStep('credentials');
                  setTotpCode('');
                  setError('');
                }}
              >
                Sign in with a different account
              </Button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Authorized personnel only
        </p>
      </div>
    </div>
  );
};

export default CMSLogin;
