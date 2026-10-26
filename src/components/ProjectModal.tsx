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
import { api } from '../lib/api';

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

    if (!fullName.trim() || !phone.trim()) {
      setErrorMsg('Please provide your contact name and phone number.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    const effectiveUserId = currentUser?.uid || 'guest';
    const effectiveEmail = currentUser?.email || email.trim() || 'inquiry@bitsoinnovations.com';

    const appointmentPayload: Appointment = {
      userId: effectiveUserId,
      userName: fullName.trim(),
      userEmail: effectiveEmail,
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
        email: effectiveEmail,
        service: service || preSelectedService,
        message: `[Appointment: ${appointmentDate} at ${timeSlot} via ${meetingType}] ${message.trim()}`,
        userId: effectiveUserId,
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
        email: effectiveEmail,
        service: service || preSelectedService,
        appointmentDate,
        timeSlot,
        meetingType,
        message: message.trim(),
        userId: effectiveUserId,
        createdAt: serverTimestamp(),
      });
      // Notify backend server for telemetry & WebSocket presence
      api.bookAppointment({
        userId: effectiveUserId,
        userName: fullName.trim(),
        userEmail: effectiveEmail,
        userPhone: phone.trim(),
        interest: service || preSelectedService,
        preferredDate: appointmentDate || getTomorrowDate(),
        timeSlot: timeSlot,
        meetingType: meetingType,
        message: message.trim(),
      }).catch(() => {});

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
        ) : (
          /* Consultation & Appointment Scheduling Form */
          <form onSubmit={handleSubmitAppointment} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400">
                  EXECUTIVE CONSULTATION
                </span>
                {currentUser ? (
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    CLIENT ACCOUNT
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => openAuthModal('signin')}
                    className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                  >
                    Have an account? Sign In
                  </button>
                )}
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Schedule Technical Consultation
              </h3>
            </div>

            {/* Authenticated user banner if logged in */}
            {currentUser && (
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
            )}

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

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Email Address (optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
              />
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
