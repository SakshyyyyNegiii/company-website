import React, { useState, useEffect } from 'react';
import { COMPANY_INFO, SERVICES } from '../data/content';
import {
  Mail,
  MapPin,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  Send,
  Linkedin,
  Twitter,
  Instagram,
  ShieldCheck,
  User,
  LogIn,
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, onSnapshot } from 'firebase/firestore';
import { useFadeInOnScroll } from '../hooks/useFadeInOnScroll';
import { useAuth } from '../context/AuthContext';

interface ContactSectionProps {
  initialService?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  initialService = '',
}) => {
  const { ref, isVisible } = useFadeInOnScroll();
  const { currentUser, userProfile, openAuthModal, signOutUser, signInWithGooglePopup } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [preferredDate, setPreferredDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('11:00 AM - 12:00 PM IST');
  const [meetingType, setMeetingType] = useState<'video' | 'phone' | 'in-person'>('video');

  const handleGoogleAuth = async () => {
    if (googleLoading) return;
    setGoogleLoading(true);
    try {
      const res = await signInWithGooglePopup();
      if (!res.success && res.message && !res.message.includes('cancelled') && !res.message.includes('already in progress')) {
        openAuthModal('signin');
      }
    } catch {
      openAuthModal('signin');
    } finally {
      setGoogleLoading(false);
    }
  };

  // Contact form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState(initialService || 'Web Development');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [userInquiriesCount, setUserInquiriesCount] = useState<number>(0);

  // Sync logged in user profile
  useEffect(() => {
    if (currentUser) {
      setFullName(userProfile?.displayName || currentUser.displayName || '');
      setEmail(currentUser.email || '');
      if (userProfile?.phone) {
        setPhone(userProfile.phone);
      }

      // Listen to user's existing inquiries
      try {
        const q = query(collection(db, 'inquiries'), where('userId', '==', currentUser.uid));
        const unsub = onSnapshot(
          q,
          (snapshot) => {
            setUserInquiriesCount(snapshot.size);
          },
          () => {
            // gracefully ignore network hiccups
          }
        );
        return () => unsub();
      } catch {
        // fallback
      }
    }
  }, [currentUser, userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setErrorMsg('Please sign in or create an account before booking your appointment.');
      openAuthModal('signin', 'Please sign in or create an account before booking your appointment.');
      return;
    }

    if (!fullName.trim() || !phone.trim()) {
      setErrorMsg('Please enter your name and contact phone number.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    const inqData = {
      name: fullName.trim(),
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: currentUser.email || email.trim(),
      service: service,
      appointmentDate: preferredDate,
      timeSlot: timeSlot,
      meetingType: meetingType,
      message: message.trim(),
      userId: currentUser.uid,
      createdAt: { seconds: Math.floor(Date.now() / 1000) },
    };

    try {
      const raw = localStorage.getItem('bitso_local_inquiries');
      const list = raw ? JSON.parse(raw) : [];
      list.unshift(inqData);
      localStorage.setItem('bitso_local_inquiries', JSON.stringify(list));
    } catch {
      // ignore
    }

    try {
      const rawAppts = localStorage.getItem('bitso_offline_appointments');
      const apptList = rawAppts ? JSON.parse(rawAppts) : [];
      apptList.unshift({
        userId: currentUser.uid,
        userName: fullName.trim(),
        userEmail: currentUser.email || email.trim(),
        userPhone: phone.trim(),
        interest: service,
        preferredDate: preferredDate,
        timeSlot: timeSlot,
        meetingType: meetingType,
        message: message.trim(),
        status: 'confirmed',
        createdAt: { seconds: Math.floor(Date.now() / 1000) },
      });
      localStorage.setItem('bitso_offline_appointments', JSON.stringify(apptList));
    } catch {
      // ignore
    }

    try {
      await addDoc(collection(db, 'inquiries'), {
        ...inqData,
        createdAt: serverTimestamp(),
      });
      await addDoc(collection(db, 'appointments'), {
        userId: currentUser.uid,
        userName: fullName.trim(),
        userEmail: currentUser.email || email.trim(),
        userPhone: phone.trim(),
        interest: service,
        preferredDate: preferredDate,
        timeSlot: timeSlot,
        meetingType: meetingType,
        message: message.trim(),
        status: 'confirmed',
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'inquiries');
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent(
      'Hello Bitso Innovations team! I would like to consult on an enterprise digital project.'
    );
    window.open(`https://wa.me/91${COMPANY_INFO.contact.rawPhones[0]}?text=${text}`, '_blank');
  };

  return (
    <section id="contact" className="py-20 sm:py-28 relative border-t border-white/5 bg-slate-950/80">
      {/* Glow highlight */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div
        ref={ref}
        className={`transition-all duration-700 ease-out motion-reduce:transition-none ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        } max-w-6xl mx-auto px-4 sm:px-6 lg:px-8`}
      >
        {/* Main CTA Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">
            START YOUR PROJECT
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight text-balance">
            {COMPANY_INFO.ctaHeading}
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-slate-300 max-w-xl mx-auto text-balance font-normal">
            {COMPANY_INFO.ctaSubline}
          </p>

          {/* Account Status Pill */}
          <div className="mt-6 inline-flex items-center gap-3 p-1.5 px-4 rounded-full bg-slate-900/90 border border-white/10 text-xs backdrop-blur-md">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-white font-medium">
                  Signed in as <span className="text-cyan-400 font-semibold">{currentUser.displayName || currentUser.email}</span>
                </span>
                <button
                  type="button"
                  onClick={() => signOutUser()}
                  className="text-slate-400 hover:text-white underline ml-1 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Account:</span>
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={googleLoading}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold shadow transition-all cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.9c2.28-2.1 3.64-5.2 3.64-9.14z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.73-2.1-6.67-4.93H1.28v3.15C3.3 21.36 7.37 24 12 24z" />
                    <path fill="#FBBC05" d="M5.33 14.27c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.28C.46 8.21 0 10.05 0 12s.46 3.79 1.28 5.42l4.05-3.15z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.3 2.64 1.28 6.58l4.05 3.15c.94-2.83 3.57-4.98 6.67-4.98z" />
                  </svg>
                  <span>Google Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('signin')}
                  className="text-cyan-400 font-bold hover:text-cyan-300 ml-1 cursor-pointer flex items-center gap-1 text-xs"
                >
                  <LogIn className="w-3 h-3" />
                  <span>Email Sign In</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Essential Contact Info & Socials */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md">
              <h3 className="text-lg font-bold text-white tracking-tight mb-6">
                Direct Contact
              </h3>

              <div className="space-y-5">
                <div className="flex items-start gap-4 text-slate-300">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-cyan-400 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-slate-400">Key Contact / Leadership</div>
                    <div className="text-sm font-bold text-white tracking-wide">
                      {COMPANY_INFO.contact.contactPerson}
                    </div>
                  </div>
                </div>

                <a
                  href={`mailto:${COMPANY_INFO.contact.email}`}
                  className="flex items-start gap-4 text-slate-300 hover:text-cyan-400 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-cyan-400 group-hover:border-cyan-500/40 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-slate-400">Email Inquiry</div>
                    <div className="text-sm font-semibold text-white group-hover:text-cyan-400">
                      {COMPANY_INFO.contact.email}
                    </div>
                  </div>
                </a>

                <a
                  href={`https://wa.me/91${COMPANY_INFO.contact.rawPhones[0]}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-4 text-slate-300 hover:text-emerald-400 transition-colors group cursor-pointer"
                  title="Phone / WhatsApp"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:border-emerald-500/40 shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-slate-400">Phone / WhatsApp</div>
                    <div className="text-sm font-semibold text-white group-hover:text-emerald-400">
                      {COMPANY_INFO.contact.phone}
                    </div>
                  </div>
                </a>

                <div className="flex items-start gap-4 text-slate-300">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-cyan-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-slate-400">Location</div>
                    <div className="text-sm font-semibold text-white">
                      {COMPANY_INFO.contact.location}
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Action Button */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={openWhatsApp}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Essential Social Links */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-white/5 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">CONNECT WITH US</span>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.linkedin.com/company/bitso-innovations/?viewAsMember=true"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 flex items-center justify-center transition-all cursor-pointer"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://www.instagram.com/bitso_i.t?stkn=djUwOTUzZ2MxOW90"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 hover:text-white text-slate-300 flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={`https://wa.me/91${COMPANY_INFO.contact.rawPhones[0]}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-white text-slate-300 flex items-center justify-center transition-all cursor-pointer"
                  aria-label="WhatsApp"
                  title="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a
                  href="https://twitter.com/bitsoinnovate"
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 flex items-center justify-center transition-all cursor-pointer"
                  aria-label="Twitter"
                  title="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Project Kickoff Form */}
          <div className="lg:col-span-7">
            <div className="p-7 sm:p-9 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-2xl">
              {submitted ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight mb-2">
                    Inquiry & Architecture Scope Logged
                  </h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto mb-6">
                    Thank you! Our technical directors will review your system specifications and reach out within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setMessage('');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
                  >
                    Submit Another Scope
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      Project Intake & Architecture Scope
                    </h3>
                    <span className="text-[11px] font-mono text-cyan-400">DIRECT FOUNDER REVIEW</span>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1.5">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 99903 66072"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1.5">
                        Work Email
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="rahul@company.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1.5">
                        Service Focus
                      </label>
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                      >
                        {SERVICES.map((s) => (
                          <option key={s.id} value={s.title} className="bg-slate-950 text-white">
                            {s.title}
                          </option>
                        ))}
                        <option value="Custom Project" className="bg-slate-950 text-white">
                          Other / Comprehensive Transformation
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Preferred Appointment Schedule */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                        Appointment Scheduling
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        DIRECT LEADERSHIP CALENDAR
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">
                          Preferred Date *
                        </label>
                        <input
                          type="date"
                          required
                          min={new Date().toISOString().split('T')[0]}
                          value={preferredDate}
                          onChange={(e) => setPreferredDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">
                          Time Slot *
                        </label>
                        <select
                          value={timeSlot}
                          onChange={(e) => setTimeSlot(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                        >
                          <option value="10:00 AM - 11:00 AM IST">10:00 AM - 11:00 AM IST</option>
                          <option value="11:00 AM - 12:00 PM IST">11:00 AM - 12:00 PM IST</option>
                          <option value="02:00 PM - 03:00 PM IST">02:00 PM - 03:00 PM IST</option>
                          <option value="04:30 PM - 05:30 PM IST">04:30 PM - 05:30 PM IST</option>
                          <option value="07:00 PM - 08:00 PM IST">07:00 PM - 08:00 PM IST</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-slate-400 mb-1">
                          Format *
                        </label>
                        <select
                          value={meetingType}
                          onChange={(e) => setMeetingType(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                        >
                          <option value="video">Google Meet Video</option>
                          <option value="phone">WhatsApp Audio</option>
                          <option value="in-person">In-Person Technical</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-mono text-slate-400">
                        Technical Scope & Agenda Notes
                      </label>
                      <span className="text-[10px] font-mono text-slate-500">
                        Blueprint details automatically injected
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your current system, performance bottlenecks, or business goals..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-colors resize-none font-mono"
                    />
                  </div>

                  {!currentUser && (
                    <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs space-y-2.5">
                      <div className="flex items-center gap-2 text-cyan-300 font-semibold">
                        <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>Sign In or Sign Up Required Before Booking</span>
                      </div>
                      <p className="text-slate-300 text-[11px]">
                        Please sign in with Google or your email to schedule this technical appointment and preserve your project scope.
                      </p>
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={handleGoogleAuth}
                          disabled={googleLoading}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow transition-all cursor-pointer disabled:opacity-50"
                        >
                          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.9c2.28-2.1 3.64-5.2 3.64-9.14z" />
                            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.73-2.1-6.67-4.93H1.28v3.15C3.3 21.36 7.37 24 12 24z" />
                            <path fill="#FBBC05" d="M5.33 14.27c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.28C.46 8.21 0 10.05 0 12s.46 3.79 1.28 5.42l4.05-3.15z" />
                            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.3 2.64 1.28 6.58l4.05 3.15c.94-2.83 3.57-4.98 6.67-4.98z" />
                          </svg>
                          <span>{googleLoading ? 'Connecting...' : 'Sign in with Google'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => openAuthModal('signin')}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-white/10 transition-colors cursor-pointer"
                        >
                          Sign In
                        </button>
                        <button
                          type="button"
                          onClick={() => openAuthModal('signup')}
                          className="px-3 py-1.5 rounded-xl text-cyan-400 hover:text-cyan-300 font-semibold text-xs transition-colors cursor-pointer"
                        >
                          Create Account
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-400/35 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Scheduling Appointment...</span>
                    ) : !currentUser ? (
                      <>
                        <span>Sign In & Book Technical Appointment</span>
                        <LogIn className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <span>Confirm Technical Appointment</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
