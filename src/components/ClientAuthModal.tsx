import React, { useState, useEffect } from 'react';
import { useAuth, AuthModalMode } from '../context/AuthContext';
import {
  X,
  LogIn,
  UserPlus,
  ShieldCheck,
  Zap,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle2,
  Mail,
  User,
  Phone,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

interface ClientAuthModalProps {
  onOpenDashboard?: () => void;
}

export const ClientAuthModal: React.FC<ClientAuthModalProps> = ({ onOpenDashboard }) => {
  const {
    isAuthModalOpen,
    authModalMode,
    authPromptMessage,
    currentUser,
    userProfile,
    closeAuthModal,
    openAuthModal,
    signInWithEmail,
    signUpWithEmail,
    forgotPassword,
    resetPassword,
    updateUserProfile,
    signInWithGooglePopup,
    signInDemoClient,
    signOutUser,
  } = useAuth();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Password reset states
  const [resetToken, setResetToken] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Reset form inputs on mode change
  useEffect(() => {
    setErrorMsg('');
    setSuccessMsg('');
    setShowPassword(false);
    setShowConfirmPassword(false);

    if (authModalMode === 'profile' && userProfile) {
      setFullName(userProfile.displayName || '');
      setPhoneNumber(userProfile.phone || '');
    }
  }, [authModalMode, userProfile]);

  if (!isAuthModalOpen) return null;

  // -------------------------------------------------------------
  // Form Submission Handlers
  // -------------------------------------------------------------

  // 1. Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setErrorMsg('Please enter your work email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMsg('Please enter a valid email address (e.g. name@company.com).');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your account password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await signInWithEmail(cleanEmail, password, rememberMe);
      setSuccessMsg(res?.message || 'Signed in successfully.');
      setTimeout(() => {
        closeAuthModal();
        onOpenDashboard?.();
      }, 500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = fullName.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!cleanEmail) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrorMsg('Please enter a valid email format.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters in length.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify both password fields.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await signUpWithEmail(
        cleanEmail,
        password,
        cleanName,
        phoneNumber.trim() || undefined,
        confirmPassword
      );
      setSuccessMsg(res?.message || 'Account successfully created.');
      setTimeout(() => {
        closeAuthModal();
        onOpenDashboard?.();
      }, 500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Account creation could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setErrorMsg('Please enter the email associated with your account.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await forgotPassword(cleanEmail);
      setSuccessMsg(res.message);
      if (res.resetToken) setResetToken(res.resetToken);
      if (res.resetCode) setResetCode(res.resetCode);

      // Transition to reset password view
      setTimeout(() => {
        openAuthModal('reset');
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not process password reset request.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();

    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMsg('Password confirmation does not match.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await resetPassword(cleanEmail, newPassword, resetToken, resetCode);
      setSuccessMsg(res.message);
      setTimeout(() => {
        openAuthModal('signin', 'Password updated! Please sign in with your new credentials.');
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Password reset failed. Please request a new link.');
    } finally {
      setLoading(false);
    }
  };

  // 5. Update Profile
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await updateUserProfile(fullName, phoneNumber);
      setSuccessMsg(res?.message || 'Profile updated successfully.');
      setTimeout(() => {
        closeAuthModal();
      }, 900);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  // Instant Demo Sign In
  const handleInstantDemo = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await signInDemoClient(
        email.trim() || 'client.partner@bitsoinnovations.com',
        fullName.trim() || 'Client Partner',
        phoneNumber.trim() || '+91 99903 66072'
      );
      closeAuthModal();
      onOpenDashboard?.();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Could not initialize client session.');
    } finally {
      setLoading(false);
    }
  };

  // Google Sign In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await signInWithGooglePopup(email.trim() || undefined);
      closeAuthModal();
      onOpenDashboard?.();
    } catch (err: any) {
      setErrorMsg(err.message || 'Google sign-in could not be completed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-white/10 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-3">
            {authModalMode === 'signin' && <LogIn className="w-6 h-6" />}
            {authModalMode === 'signup' && <UserPlus className="w-6 h-6" />}
            {authModalMode === 'forgot' && <KeyRound className="w-6 h-6" />}
            {authModalMode === 'reset' && <RefreshCw className="w-6 h-6" />}
            {authModalMode === 'profile' && <User className="w-6 h-6" />}
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {authModalMode === 'signin' && 'Sign In to Your Account'}
            {authModalMode === 'signup' && 'Create Your Client Account'}
            {authModalMode === 'forgot' && 'Reset Your Password'}
            {authModalMode === 'reset' && 'Set New Password'}
            {authModalMode === 'profile' && 'Your Client Profile'}
          </h3>

          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            {authPromptMessage || (
              authModalMode === 'signin'
                ? 'Access your digital projects, live milestones, and architectural specs.'
                : authModalMode === 'signup'
                ? 'Join Bitso Innovations to manage your enterprise solutions.'
                : authModalMode === 'forgot'
                ? 'Enter your registered email to receive recovery instructions.'
                : authModalMode === 'reset'
                ? 'Enter your recovery code and choose a secure new password.'
                : 'Manage your authenticated enterprise contact credentials.'
            )}
          </p>
        </div>

        {/* Alert Notifications */}
        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <div className="flex-grow">{errorMsg}</div>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            <div className="flex-grow">{successMsg}</div>
          </div>
        )}

        {/* ----------------------------------------------------------- */}
        {/* VIEW 1: SIGN IN                                             */}
        {/* ----------------------------------------------------------- */}
        {authModalMode === 'signin' && (
          <>
            {/* Quick 1-Click Client Access */}
            <button
              type="button"
              onClick={handleInstantDemo}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition-all cursor-pointer disabled:opacity-50 mb-3"
            >
              <Zap className="w-4 h-4 text-slate-950" />
              <span>1-Click Instant Client Access</span>
            </button>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-white font-medium text-xs shadow-md transition-all cursor-pointer disabled:opacity-50 mb-4"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.9c2.28-2.1 3.64-5.2 3.64-9.14z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.73-2.1-6.67-4.93H1.28v3.15C3.3 21.36 7.37 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.33 14.27c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.28C.46 8.21 0 10.05 0 12s.46 3.79 1.28 5.42l4.05-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.3 2.64 1.28 6.58l4.05 3.15c.94-2.83 3.57-4.98 6.67-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-grow h-px bg-white/10" />
              <span className="text-[10px] font-mono text-slate-500 uppercase">OR WITH EMAIL</span>
              <div className="flex-grow h-px bg-white/10" />
            </div>

            <form onSubmit={handleSignIn} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-slate-950 border-white/20 text-cyan-500 focus:ring-cyan-500"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => openAuthModal('forgot')}
                  className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 text-center text-xs text-slate-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => openAuthModal('signup')}
                className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors cursor-pointer ml-1"
              >
                Sign Up
              </button>
            </div>
          </>
        )}

        {/* ----------------------------------------------------------- */}
        {/* VIEW 2: SIGN UP                                             */}
        {/* ----------------------------------------------------------- */}
        {authModalMode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Vikram Singhania"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 99903 66072"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50 mt-3 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="mt-5 text-center text-xs text-slate-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => openAuthModal('signin')}
                className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors cursor-pointer ml-1"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* ----------------------------------------------------------- */}
        {/* VIEW 3: FORGOT PASSWORD                                     */}
        {/* ----------------------------------------------------------- */}
        {authModalMode === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              Enter your account email address below. We'll generate a verification code and secure reset link for your account.
            </p>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Account Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Sending Instructions...' : 'Send Password Reset Code'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => openAuthModal('signin')}
                className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                ← Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* ----------------------------------------------------------- */}
        {/* VIEW 4: RESET PASSWORD                                      */}
        {/* ----------------------------------------------------------- */}
        {authModalMode === 'reset' && (
          <form onSubmit={handleResetPassword} className="space-y-3.5">
            {resetCode && (
              <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-xs text-cyan-300 font-mono text-center">
                <span>Verification Code: </span>
                <span className="font-bold text-white text-sm tracking-widest">{resetCode}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Account Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? 'Updating Password...' : 'Update Password & Sign In'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => openAuthModal('signin')}
                className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                ← Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* ----------------------------------------------------------- */}
        {/* VIEW 5: USER PROFILE                                        */}
        {/* ----------------------------------------------------------- */}
        {authModalMode === 'profile' && (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Account Role</span>
                <span className="font-mono text-cyan-400 uppercase font-semibold">
                  {userProfile?.role || 'Verified Client'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Registered Email</span>
                <span className="font-mono text-white truncate max-w-[200px]">
                  {currentUser?.email || userProfile?.email}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Display Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all cursor-pointer"
              >
                {loading ? 'Saving...' : 'Save Profile'}
              </button>
              <button
                type="button"
                onClick={() => {
                  closeAuthModal();
                  onOpenDashboard?.();
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-all cursor-pointer"
              >
                Open Dashboard
              </button>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-between items-center text-xs">
              <button
                type="button"
                onClick={() => openAuthModal('forgot')}
                className="text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
              >
                Change Password
              </button>
              <button
                type="button"
                onClick={async () => {
                  await signOutUser();
                  closeAuthModal();
                }}
                className="text-rose-400 hover:text-rose-300 font-medium transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
