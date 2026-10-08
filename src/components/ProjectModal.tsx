import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  CheckCircle2,
  Check,
  Loader2,
  Calendar,
  Clock,
  Video,
  ShieldCheck,
  LogIn,
  UserPlus,
  Eye,
  EyeOff,
  AlertCircle,
  Phone,
  User as UserIcon,
} from 'lucide-react';
import { SERVICES } from '../data/content';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Appointment } from '../types';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedService?: string;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  preSelectedService = 'Web Development',
}) => {
  const {
    currentUser,
    userProfile,
    signInWithEmail,
    signUpWithEmail,
    signInWithGooglePopup,
    openAuthModal,
    signOutUser,
  } = useAuth();

  // Mode: Auth or Appointment
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Appointment details
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState(preSelectedService);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('11:00 AM - 12:00 PM IST');
  const [meetingType, setMeetingType] = useState<'video' | 'phone' | 'in-person'>('video');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookedDetails, setBookedDetails] = useState<Appointment | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Default appointment date to tomorrow in YYYY-MM-DD
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Sync state on open & user changes
  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setIsSuccess(false);
      setErrorMsg('');
      setAuthError('');
      setService(preSelectedService);
      setAppointmentDate(getTomorrowDate());

      if (currentUser) {
        setFullName(userProfile?.displayName || currentUser.displayName || '');
        setEmail(currentUser.email || '');
        if (userProfile?.phone) {
          setPhone(userProfile.phone);
        }
      }
    }
  }, [isOpen, preSelectedService, currentUser, userProfile]);

  if (!isOpen) return null;

  // -------------------------------------------------------------
  // Google Auth Handler
  // -------------------------------------------------------------
  const handleGoogleAuth = async () => {
    if (authLoading) return;
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await signInWithGooglePopup();
      if (!res.success && res.message && !res.message.includes('cancelled') && !res.message.includes('already in progress')) {
        setAuthError(res.message);
      }
    } catch (err: any) {
      if (err?.code !== 'auth/cancelled-popup-request') {
        setAuthError(err?.message || 'Google sign-in could not be completed.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  // -------------------------------------------------------------
  // Inline Email Sign In
  // -------------------------------------------------------------
  const handleInlineSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword) {
      setAuthError('Please enter both email and password.');
      return;
    }
    setAuthLoading(true);
    setAuthError('');
    try {
      await signInWithEmail(authEmail.trim(), authPassword, true);
    } catch (err: any) {
      setAuthError(err?.message || 'Invalid email or password.');
    } finally {
      setAuthLoading(false);
    }
  };

  // -------------------------------------------------------------
  // Inline Email Sign Up
  // -------------------------------------------------------------
  const handleInlineSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !authEmail.trim() || !authPassword) {
      setAuthError('Please complete your name, email, and password.');
      return;
    }
    if (authPassword.length < 8) {
      setAuthError('Password must be at least 8 characters.');
      return;
    }
    setAuthLoading(true);
    setAuthError('');
    try {
      await signUpWithEmail(
        authEmail.trim(),
        authPassword,
        signupName.trim(),
        signupPhone.trim() || undefined,
        authPassword
      );
    } catch (err: any) {
      setAuthError(err?.message || 'Sign up could not be completed.');
    } finally {
      setAuthLoading(false);
    }
  };

  // -------------------------------------------------------------
  // Appointment Submission Handler
  // -------------------------------------------------------------
  const handleSubmitAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthError('Please sign in or sign up before booking your appointment.');
      return;
    }

    if (!fullName.trim() || !phone.trim()) {
      setErrorMsg('Please provide your contact name and phone number.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    const appointmentPayload: Appointment = {
      userId: currentUser.uid,
      userName: fullName.trim(),
      userEmail: currentUser.email || email.trim(),
      userPhone: phone.trim(),
      interest: service || preSelectedService,
      preferredDate: appointmentDate || getTomorrowDate(),
      timeSlot: timeSlot,
      meetingType: meetingType,
      message: message.trim(),
      status: 'confirmed',
      createdAt: { seconds: Math.floor(Date.now() / 1000) },
    };

    // Store in offline cache
    try {
      const raw = localStorage.getItem('bitso_offline_appointments');
      const list = raw ? JSON.parse(raw) : [];
      list.unshift(appointmentPayload);
      localStorage.setItem('bitso_offline_appointments', JSON.stringify(list));
    } catch {
      // ignore
    }

    // Also cache as an inquiry
    try {
      const rawInq = localStorage.getItem('bitso_local_inquiries');
      const inqList = rawInq ? JSON.parse(rawInq) : [];
      inqList.unshift({
        name: fullName.trim(),
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: currentUser.email || email.trim(),
        service: service || preSelectedService,
        message: `[Appointment: ${appointmentDate} at ${timeSlot} via ${meetingType}] ${message.trim()}`,
        userId: currentUser.uid,
        createdAt: { seconds: Math.floor(Date.now() / 1000) },
      });
      localStorage.setItem('bitso_local_inquiries', JSON.stringify(inqList));
    } catch {
      // ignore
    }

    // Attempt Firebase sync
    try {
      await addDoc(collection(db, 'appointments'), {
        ...appointmentPayload,
        createdAt: serverTimestamp(),
      });
      await addDoc(collection(db, 'inquiries'), {
        name: fullName.trim(),
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: currentUser.email || email.trim(),
        service: service || preSelectedService,
        appointmentDate,
        timeSlot,
        meetingType,
        message: message.trim(),
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
      });
      setBookedDetails(appointmentPayload);
      setIsSuccess(true);
      setTimeout(() => {
        setSubmitted(true);
        setIsSuccess(false);
      }, 750);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'appointments');
      // Local persistence succeeded
      setBookedDetails(appointmentPayload);
      setIsSuccess(true);
      setTimeout(() => {
        setSubmitted(true);
        setIsSuccess(false);
      }, 750);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-white/10 shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          /* Success Screen */
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Appointment Confirmed!
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Your technical consultation has been scheduled with Bitso engineering leadership.
              </p>
            </div>

            {bookedDetails && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 text-left space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-slate-400">Scheduled For:</span>
                  <span className="font-semibold text-cyan-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{bookedDetails.preferredDate}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-slate-400">Time Slot:</span>
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{bookedDetails.timeSlot}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-slate-400">Meeting Format:</span>
                  <span className="font-semibold text-white capitalize flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{bookedDetails.meetingType === 'video' ? 'Google Meet Video' : bookedDetails.meetingType}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Attendee:</span>
                  <span className="font-semibold text-white truncate max-w-[200px]">
                    {bookedDetails.userName} ({bookedDetails.userEmail})
                  </span>
                </div>
              </div>
            )}

            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              A calendar invitation and WhatsApp meeting reminder have been prepared for your contact details.
            </p>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              Done
            </button>
          </div>
        ) : !currentUser ? (
          /* STEP 1: Sign In / Sign Up Before Appointment */
          <div className="space-y-4">
            <div className="text-center pb-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-mono uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>STEP 1: USER AUTHENTICATION</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Sign In to Schedule Appointment
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Please sign in or create an account to book your technical appointment and preserve your project specifications.
              </p>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{authError}</span>
              </div>
            )}

            {/* Quick 1-Click Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={authLoading}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.9c2.28-2.1 3.64-5.2 3.64-9.14z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.73-2.1-6.67-4.93H1.28v3.15C3.3 21.36 7.37 24 12 24z" />
                <path fill="#FBBC05" d="M5.33 14.27c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.28C.46 8.21 0 10.05 0 12s.46 3.79 1.28 5.42l4.05-3.15z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.3 2.64 1.28 6.58l4.05 3.15c.94-2.83 3.57-4.98 6.67-4.98z" />
              </svg>
              <span>{authLoading ? 'Connecting with Google...' : 'Continue with Google'}</span>
            </button>

            <div className="flex items-center gap-3 my-2">
              <div className="flex-grow h-px bg-white/10" />
              <span className="text-[10px] font-mono text-slate-500 uppercase">OR WITH EMAIL</span>
              <div className="flex-grow h-px bg-white/10" />
            </div>

            {/* Toggle Sign In / Sign Up */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-950 border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => {
                  setAuthTab('signin');
                  setAuthError('');
                }}
                className={`py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                  authTab === 'signin'
                    ? 'bg-slate-800 text-cyan-400 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthTab('signup');
                  setAuthError('');
                }}
                className={`py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                  authTab === 'signup'
                    ? 'bg-slate-800 text-cyan-400 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Account
              </button>
            </div>

            {authTab === 'signin' ? (
              /* Inline Sign In Form */
              <form onSubmit={handleInlineSignIn} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
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
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end text-xs">
                  <button
                    type="button"
                    onClick={() => openAuthModal('forgot')}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {authLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Sign In & Continue to Appointment</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Inline Sign Up Form */
              <form onSubmit={handleInlineSignUp} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="e.g. Vikram Singhania"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      placeholder="+91 99903 66072"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    Password (min 8 chars) *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="Create secure password"
                      className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {authLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Register & Continue to Appointment</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        ) : (
          /* STEP 2: Appointment Details & Scope */
          <form onSubmit={handleSubmitAppointment} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400">
                  STEP 2: APPOINTMENT SCHEDULE
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  AUTHENTICATED
                </span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Schedule Technical Consultation
              </h3>
            </div>

            {/* Authenticated user banner */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300 truncate">
                <UserIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">
                  Booking as <strong className="text-white">{currentUser.displayName || currentUser.email}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => signOutUser()}
                className="text-[11px] text-slate-400 hover:text-rose-400 underline shrink-0 cursor-pointer ml-2"
              >
                Switch
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}

            {/* Date & Time Slot Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Preferred Date *</span>
                </label>
                <input
                  type="date"
                  required
                  min={getTodayDate()}
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Time Slot *</span>
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                >
                  <option value="10:00 AM - 11:00 AM IST">10:00 AM - 11:00 AM IST</option>
                  <option value="11:00 AM - 12:00 PM IST">11:00 AM - 12:00 PM IST</option>
                  <option value="02:00 PM - 03:00 PM IST">02:00 PM - 03:00 PM IST</option>
                  <option value="04:30 PM - 05:30 PM IST">04:30 PM - 05:30 PM IST</option>
                  <option value="07:00 PM - 08:00 PM IST">07:00 PM - 08:00 PM IST</option>
                </select>
              </div>
            </div>

            {/* Meeting Mode & Service Focus */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1 flex items-center gap-1">
                  <Video className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Meeting Format</span>
                </label>
                <select
                  value={meetingType}
                  onChange={(e) => setMeetingType(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                >
                  <option value="video">Google Meet (Video Conference)</option>
                  <option value="phone">Phone / WhatsApp Audio Call</option>
                  <option value="in-person">In-Person Technical Review</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Service Focus
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                >
                  {SERVICES.map((s) => (
                    <option key={s.id} value={s.title}>
                      {s.title}
                    </option>
                  ))}
                  <option value="Custom Project">Other / Full Transformation</option>
                </select>
              </div>
            </div>

            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Contact Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Vikram Singhania"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Phone / WhatsApp *</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 99903 66072"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Discussion Agenda */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Consultation Agenda / Project Notes
              </label>
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Briefly state your current digital goals, timeline, or key technical challenges..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-cyan-400 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || isSuccess}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-xl transition-all duration-300 cursor-pointer disabled:opacity-90 ${
                isSuccess
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30 scale-[1.01]'
                  : submitting
                  ? 'bg-cyan-500/80 text-slate-950 cursor-wait'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/25 active:scale-[0.99]'
              }`}
            >
              {isSuccess ? (
                <span className="inline-flex items-center gap-2 text-slate-950">
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Appointment Booked!</span>
                </span>
              ) : submitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Scheduling Appointment...</span>
                </span>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  <span>Confirm Technical Appointment</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
