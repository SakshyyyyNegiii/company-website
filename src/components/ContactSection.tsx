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
  onOpenDashboard?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  initialService = '',
  onOpenDashboard,
}) => {
  const { ref, isVisible } = useFadeInOnScroll();
  const { currentUser, userProfile, openAuthModal, signOutUser } = useAuth();

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
        const q = query(collection(db, 'inquiries'), where('email', '==', currentUser.email));
        const unsub = onSnapshot(q, (snapshot) => {
          setUserInquiriesCount(snapshot.size);
        });
        return () => unsub();
      } catch {
        // fallback
      }
    }
  }, [currentUser, userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      email: email.trim(),
      service: service,
      message: message.trim(),
      userId: currentUser?.uid || null,
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
      await addDoc(collection(db, 'inquiries'), {
        ...inqData,
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

          {/* Client Portal Status Pill */}
          <div className="mt-6 inline-flex items-center gap-3 p-1.5 px-4 rounded-full bg-slate-900/90 border border-white/10 text-xs backdrop-blur-md">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <button
                  type="button"
                  onClick={() => onOpenDashboard?.()}
                  className="text-white font-medium hover:text-cyan-300 transition-colors text-left"
                >
                  Signed in as <span className="text-cyan-400 font-semibold">{currentUser.displayName || currentUser.email}</span>
                </button>
                {userInquiriesCount > 0 && (
                  <button
                    type="button"
                    onClick={() => onOpenDashboard?.()}
                    className="font-mono text-[10px] text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30 hover:bg-cyan-900 cursor-pointer"
                  >
                    {userInquiriesCount} Inquiries Saved
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => signOutUser()}
                  className="text-slate-400 hover:text-white underline ml-1 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Client Portal available for tracking technical inquiries</span>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenDashboard) onOpenDashboard();
                    else openAuthModal('signin');
                  }}
                  className="text-cyan-400 font-bold hover:text-cyan-300 ml-1 cursor-pointer flex items-center gap-1"
                >
                  <LogIn className="w-3 h-3" />
                  <span>Sign In</span>
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

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-mono text-slate-400">
                        Technical Scope & Notes
                      </label>
                      <span className="text-[10px] font-mono text-slate-500">
                        Blueprint details automatically injected
                      </span>
                    </div>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your current system, performance bottlenecks, or business goals..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-colors resize-none font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 hover:shadow-cyan-400/35 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Submitting Architecture Scope...</span>
                    ) : (
                      <>
                        <span>Submit Project Scope</span>
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
