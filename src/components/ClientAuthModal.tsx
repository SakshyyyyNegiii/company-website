import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, LogIn, UserPlus, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

export const ClientAuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    authPromptMessage,
    closeAuthModal,
    openAuthModal,
    signInWithEmail,
    signUpWithEmail,
    signInWithGooglePopup,
    signInDemoClient,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleInstantDemo = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await signInDemoClient(
        email.trim() || 'partner@bitsoinnovations.com',
        fullName.trim() || 'Client Partner',
        phone.trim() || '+91 93101 89235'
      );
      closeAuthModal();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Could not initialize demo session.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await signInWithGooglePopup();
      closeAuthModal();
    } catch (err: any) {
      setErrorMsg(err.message || 'Google sign-in could not be completed in this window.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your work email.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }
    if (authModalMode === 'signup' && password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      if (authModalMode === 'signin') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, fullName, phone);
      }
      closeAuthModal();
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-white/10 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            {authModalMode === 'signin' ? 'Client Portal Sign In' : 'Create Client Account'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {authPromptMessage || 'Securely track your technical project inquiries & architecture reviews.'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs space-y-2">
            <div>{errorMsg}</div>
            <button
              type="button"
              onClick={handleInstantDemo}
              className="w-full py-1.5 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Continue with 1-Click Instant Access</span>
            </button>
          </div>
        )}

        {/* Guaranteed 1-Click Instant Access Button */}
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

        {/* Email form */}
        <form onSubmit={handleEmailAuth} className="space-y-3">
          {authModalMode === 'signup' && (
            <>
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 93101 89235"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">Work Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rahul@company.com"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-white text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50 mt-2"
          >
            {loading ? 'Processing...' : authModalMode === 'signin' ? 'Sign In to Portal' : 'Register Account'}
          </button>
        </form>

        <div className="mt-4 text-center">
          {authModalMode === 'signin' ? (
            <button
              type="button"
              onClick={() => openAuthModal('signup')}
              className="text-xs text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Don't have a portal account? <span className="text-cyan-400 font-semibold">Sign Up</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal('signin')}
              className="text-xs text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Already have an account? <span className="text-cyan-400 font-semibold">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
