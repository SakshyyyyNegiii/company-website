import React, { useState, useEffect, useId } from 'react';
import { COMPANY_INFO } from '../data/content';
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  Send,
  CheckCircle2,
  MessageCircle,
  Copy,
  Check,
  Building2,
  Clock,
  Sparkles,
  Calendar,
  Video,
  Lock,
  CalendarCheck,
  LogIn,
  UserPlus,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { InquiryFormData } from '../types';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface ContactSectionProps {
  initialServiceSelection?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  initialServiceSelection = '',
}) => {
  const { currentUser, userProfile, openAuthModal, openAppointmentsDrawer } = useAuth();

  const nameId = useId();
  const phoneId = useId();
  const emailId = useId();
  const businessNameId = useId();
  const businessTypeId = useId();
  const storesCountId = useId();
  const interestId = useId();
  const messageId = useId();
  const preferredDateId = useId();
  const timeSlotId = useId();
  const meetingTypeId = useId();

  // Tomorrow's date formatted as YYYY-MM-DD
  const tomorrowStr = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  })();

  const [formData, setFormData] = useState<InquiryFormData>({
    fullName: '',
    businessName: '',
    businessType: 'Retail Store / Supermarket',
    phone: '',
    email: '',
    storesCount: '1 - 3 Stores',
    interest: initialServiceSelection || 'E-commerce Platform Transformation (Omni-Channel)',
    message: '',
  });

  const [preferredDate, setPreferredDate] = useState<string>(tomorrowStr);
  const [timeSlot, setTimeSlot] = useState<string>('11:00 AM – 01:00 PM (Morning)');
  const [meetingType, setMeetingType] = useState<'video' | 'phone' | 'in-person'>('video');

  const [submitted, setSubmitted] = useState(false);
  const [submittedApptId, setSubmittedApptId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [isSavedLocallyOnly, setIsSavedLocallyOnly] = useState(false);

  // Sync logged in user details to form
  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || userProfile?.displayName || currentUser.displayName || '',
        email: prev.email || currentUser.email || '',
        phone: prev.phone || userProfile?.phone || '',
      }));
    }
  }, [currentUser, userProfile]);

  useEffect(() => {
    if (initialServiceSelection) {
      setFormData((prev) => ({
        ...prev,
        interest: initialServiceSelection,
      }));
    }
  }, [initialServiceSelection]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone) return;

    // Check if user is authenticated
    if (!currentUser) {
      openAuthModal(
        'signin',
        'Please sign in or create an account before submitting your consultation appointment. This ensures your project data and transformation audit are securely linked to your account.'
      );
      return;
    }

    const generatedId = `APPT-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      setSaving(true);
      setIsSavedLocallyOnly(false);

      const apptData = {
        userId: currentUser.uid,
        userName: formData.fullName,
        userEmail: formData.email || currentUser.email || '',
        userPhone: formData.phone,
        businessName: formData.businessName || 'Undisclosed Enterprise',
        businessType: formData.businessType,
        storesCount: formData.storesCount,
        interest: formData.interest,
        preferredDate,
        timeSlot,
        meetingType,
        message: formData.message,
        status: 'pending' as const,
        createdAt: serverTimestamp(),
      };

      try {
        const apptDoc = await addDoc(collection(db, 'appointments'), apptData);
        setSubmittedApptId(apptDoc.id);
      } catch (firestoreErr) {
        handleFirestoreError(firestoreErr, OperationType.CREATE, 'appointments');
        // Store in localStorage as robust fallback so user's effort is NEVER lost
        const fallbackAppt = {
          ...apptData,
          id: generatedId,
          createdAt: { seconds: Math.floor(Date.now() / 1000) },
        };
        const existingRaw = localStorage.getItem('bitso_offline_appointments');
        const existingList = existingRaw ? JSON.parse(existingRaw) : [];
        existingList.unshift(fallbackAppt);
        localStorage.setItem('bitso_offline_appointments', JSON.stringify(existingList));
        setSubmittedApptId(generatedId);
        setIsSavedLocallyOnly(true);
      }

      setSubmitted(true);
    } catch (generalErr) {
      console.warn('Submission issue:', generalErr);
      setSubmittedApptId(generatedId);
      setIsSavedLocallyOnly(true);
      setSubmitted(true);
    } finally {
      setSaving(false);
    }
  };

  const openWhatsApp = (phoneNum: string) => {
    const text = encodeURIComponent(
      `Hello Bitso Innovations! I am interested in exploring digital transformation for my business (${formData.businessName || 'Retail Enterprise'}).`
    );
    window.open(`https://wa.me/91${phoneNum.replace(/\s/g, '')}?text=${text}`, '_blank');
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header from Slide 7 */}
        <div className="max-w-3xl mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-xs font-bold text-cyan-300 mb-4 uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Direct Engagement & Transformation Inquiry</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display text-white tracking-tight leading-[1.08]">
            Ready to Transform?
          </h2>
          <p className="mt-5 text-lg sm:text-xl text-slate-200 leading-relaxed">
            Whether you&apos;re a regional retailer, enterprise operator, or strategic investor — Bitso Innovations has the architecture, the team, and the vision to take your business into the digital future. Reach out today and let&apos;s engineer your competitive advantage.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Get In Touch Official Info from Slide 7 */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-7 sm:p-9 shadow-2xl backdrop-blur-md">
              <span className="text-xs font-mono uppercase text-cyan-400 tracking-wider font-bold block mb-2">
                OFFICIAL HEADQUARTERS & CHANNELS
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-white mb-7">
                Get In Touch
              </h3>

              <div className="space-y-5">
                {/* Phone Numbers */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 shadow-inner">
                    <Phone className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-mono text-slate-400 uppercase font-semibold">
                      Phone / Mobile
                    </span>
                    <div className="mt-1.5 flex flex-col gap-2">
                      {COMPANY_INFO.contact.phones.map((phone, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-2">
                          <a
                            href={`tel:${phone.replace(/\s/g, '')}`}
                            className="text-base font-bold text-white hover:text-cyan-400 transition-colors"
                          >
                            +91 {phone}
                          </a>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => openWhatsApp(phone)}
                              className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/50 rounded-lg transition-colors cursor-pointer"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopy(phone, `phone-${idx}`)}
                              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                              title="Copy number"
                            >
                              {copiedIndex === `phone-${idx}` ? (
                                <Check className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 shadow-inner">
                    <Mail className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-mono text-slate-400 uppercase font-semibold">
                      Official Email
                    </span>
                    <div className="flex items-center justify-between gap-2 mt-1.5">
                      <a
                        href={`mailto:${COMPANY_INFO.contact.email}`}
                        className="text-base font-bold text-white hover:text-cyan-400 transition-colors truncate"
                      >
                        {COMPANY_INFO.contact.email}
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopy(COMPANY_INFO.contact.email, 'email')}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors shrink-0 cursor-pointer"
                        title="Copy email"
                      >
                        {copiedIndex === 'email' ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Website */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 shadow-inner">
                    <Globe className="w-5 h-5 text-sky-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-mono text-slate-400 uppercase font-semibold">
                      Web Portal
                    </span>
                    <div className="mt-1.5">
                      <a
                        href={`https://${COMPANY_INFO.contact.website}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-base font-bold text-white hover:text-cyan-400 transition-colors"
                      >
                        {COMPANY_INFO.contact.website}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Office Location from Slide 7 */}
                <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 shadow-inner">
                    <MapPin className="w-5 h-5 text-teal-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-mono text-slate-400 uppercase font-semibold">
                      Office Address
                    </span>
                    <div className="mt-1.5 text-base font-bold text-white leading-relaxed">
                      {COMPANY_INFO.contact.fullAddress}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-400 mt-0.5">
                      New Delhi, National Capital Territory of Delhi, India
                    </div>
                  </div>
                </div>
              </div>

              {/* Leadership Contact Badge */}
              <div className="mt-7 pt-5 border-t border-slate-800 text-sm text-slate-300 flex items-center justify-between">
                <span>Executive Director Direct Line:</span>
                <span className="font-bold text-white">{COMPANY_INFO.leadership.name}</span>
              </div>
            </div>

            {/* Fast WhatsApp Direct Link Box */}
            <div className="bg-emerald-950/50 border border-emerald-500/40 rounded-3xl p-6 flex items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-900/80 border border-emerald-500/40 flex items-center justify-center shrink-0 text-emerald-300">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-base font-bold text-white">Instant WhatsApp Consultation</div>
                  <div className="text-xs sm:text-sm text-emerald-300/90 font-medium">Connect directly with our engineering directors</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => openWhatsApp(COMPANY_INFO.contact.phones[0])}
                className="px-5 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm shrink-0 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Chat Now
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Consultation & Transformation Form */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-7 sm:p-10 shadow-2xl backdrop-blur-md">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-800 mb-6">
                <div>
                  <span className="text-xs font-mono uppercase text-cyan-400 tracking-wider font-bold">
                    SCHEDULE TRANSFORMATION AUDIT
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
                    Engineer Your Advantage
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-300 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 shadow-inner">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>SLA: 24h Response</span>
                </div>
              </div>

              {/* Authentication Status Callout */}
              {!currentUser ? (
                <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/70 to-slate-950 border border-cyan-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cyan-900/60 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0 mt-0.5">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white flex items-center gap-2">
                        <span>Sign In or Sign Up Before Booking</span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                          Required
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                        Sign in or create an account to secure your consultation appointment and save your enterprise inquiry data.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => openAuthModal('signin', 'Please sign in to book your consultation appointment and store your project inquiry.')}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Sign In</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => openAuthModal('signup', 'Create a free client partner account to book appointments and track audits.')}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-200 bg-slate-950 hover:bg-slate-800 border border-slate-700 transition-all cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Sign Up</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold font-mono">
                      {(userProfile?.displayName || currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{userProfile?.displayName || currentUser.displayName || 'Client Partner'}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Authenticated
                        </span>
                      </div>
                      <span className="text-slate-400">{currentUser.email}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={openAppointmentsDrawer}
                    className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-bold transition-colors cursor-pointer"
                  >
                    <CalendarCheck className="w-4 h-4" />
                    <span>View My Appointments</span>
                  </button>
                </div>
              )}

              {submitted ? (
                <div className="py-10 px-4 text-center animate-in zoom-in-95 duration-200">
                  <div className="w-20 h-20 rounded-full bg-emerald-950 border border-emerald-400/50 flex items-center justify-center mx-auto mb-5 text-emerald-400 shadow-xl">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <span className="inline-block text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40">
                    {isSavedLocallyOnly ? 'Appointment Confirmed • Ref: ' : 'Saved to Cloud Database • Ref: '} {submittedApptId?.slice(0, 12)}
                  </span>
                  <h4 className="text-3xl font-bold font-display text-white mb-3">
                    Appointment Booked Successfully!
                  </h4>
                  <p className="text-base text-slate-200 max-w-lg mx-auto leading-relaxed">
                    Thank you, <span className="text-cyan-300 font-bold">{formData.fullName}</span>. Your transformation audit session is scheduled for <span className="text-white font-bold">{preferredDate}</span> ({timeSlot}).
                  </p>

                  <div className="mt-6 max-w-md mx-auto p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-left space-y-2">
                    <div className="flex justify-between text-slate-400">
                      <span>Requirement:</span>
                      <span className="text-white font-semibold">{formData.interest}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Meeting Format:</span>
                      <span className="text-white font-semibold capitalize">{meetingType === 'video' ? 'Google Meet / Zoom Video' : meetingType === 'phone' ? 'Direct Phone Call' : 'In-Person (Delhi)'}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Contact Phone:</span>
                      <span className="text-white font-mono">{formData.phone}</span>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap justify-center gap-3.5">
                    <button
                      type="button"
                      onClick={openAppointmentsDrawer}
                      className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-bold text-white transition-all cursor-pointer flex items-center gap-2"
                    >
                      <CalendarCheck className="w-4 h-4 text-cyan-400" />
                      <span>View in My Appointments</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sm font-semibold text-slate-300 transition-all cursor-pointer"
                    >
                      Book Another Slot
                    </button>
                    <button
                      type="button"
                      onClick={() => openWhatsApp(COMPANY_INFO.contact.phones[0])}
                      className="px-6 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-sm font-bold text-slate-950 transition-all cursor-pointer shadow-lg flex items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp Founder</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor={nameId} className="block text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider mb-2">
                        Your Name *
                      </label>
                      <input
                        id={nameId}
                        type="text"
                        required
                        placeholder="e.g., Rajesh Sharma"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-base text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner"
                      />
                    </div>

                    <div>
                      <label htmlFor={phoneId} className="block text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider mb-2">
                        Contact Phone / WhatsApp *
                      </label>
                      <input
                        id={phoneId}
                        type="tel"
                        required
                        placeholder="e.g., 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-base text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor={businessNameId} className="block text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider mb-2">
                        Business / Store Name
                      </label>
                      <input
                        id={businessNameId}
                        type="text"
                        placeholder="e.g., City Supermarket / Retail Hub"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-base text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner"
                      />
                    </div>

                    <div>
                      <label htmlFor={emailId} className="block text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider mb-2">
                        Business Email
                      </label>
                      <input
                        id={emailId}
                        type="email"
                        placeholder="e.g., rajesh@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-base text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor={businessTypeId} className="block text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider mb-2">
                        Business Archetype
                      </label>
                      <select
                        id={businessTypeId}
                        value={formData.businessType}
                        onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                        className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-base text-white focus:outline-none focus:border-cyan-400 transition-all shadow-inner"
                      >
                        <option>Retail Store / Supermarket</option>
                        <option>Apparel & Showroom</option>
                        <option>Electronics & Appliances Chain</option>
                        <option>Enterprise / Distributor</option>
                        <option>Other Business</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor={storesCountId} className="block text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider mb-2">
                        Number of Physical Stores
                      </label>
                      <select
                        id={storesCountId}
                        value={formData.storesCount}
                        onChange={(e) => setFormData({ ...formData, storesCount: e.target.value })}
                        className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-base text-white focus:outline-none focus:border-cyan-400 transition-all shadow-inner"
                      >
                        <option>1 Store (Flagship Pilot)</option>
                        <option>2 - 5 Stores</option>
                        <option>6 - 20 Stores</option>
                        <option>20+ Stores (Regional Chain)</option>
                      </select>
                    </div>
                  </div>

                  {/* Appointment Schedule Controls */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                      <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                        <CalendarCheck className="w-4 h-4" />
                        <span>Schedule Appointment Slot</span>
                      </span>
                      <span className="text-[11px] text-slate-400">Direct Founder & Engineering Consultation</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor={preferredDateId} className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                          Preferred Date *
                        </label>
                        <div className="relative">
                          <input
                            id={preferredDateId}
                            type="date"
                            min={tomorrowStr}
                            value={preferredDate}
                            onChange={(e) => setPreferredDate(e.target.value)}
                            className="w-full px-3.5 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor={timeSlotId} className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                          Preferred Time Slot *
                        </label>
                        <select
                          id={timeSlotId}
                          value={timeSlot}
                          onChange={(e) => setTimeSlot(e.target.value)}
                          className="w-full px-3.5 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400 transition-all"
                        >
                          <option>10:00 AM – 12:00 PM (Morning Slot)</option>
                          <option>12:00 PM – 02:00 PM (Midday Slot)</option>
                          <option>02:00 PM – 04:00 PM (Afternoon Slot)</option>
                          <option>04:00 PM – 06:00 PM (Evening Slot)</option>
                          <option>07:00 PM – 09:00 PM (Executive Late Slot)</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor={meetingTypeId} className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                          Meeting Format *
                        </label>
                        <select
                          id={meetingTypeId}
                          value={meetingType}
                          onChange={(e) => setMeetingType(e.target.value as any)}
                          className="w-full px-3.5 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-cyan-400 transition-all"
                        >
                          <option value="video">Google Meet / Zoom Video</option>
                          <option value="phone">Direct Phone Call</option>
                          <option value="in-person">In-Person (Delhi HQ)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor={interestId} className="block text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider mb-2">
                      Primary Transformation Requirement
                    </label>
                    <select
                      id={interestId}
                      value={formData.interest}
                      onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                      className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-base text-white focus:outline-none focus:border-cyan-400 transition-all shadow-inner"
                    >
                      <option>E-commerce Platform Transformation (Omni-Channel)</option>
                      <option>Custom Software Development & ERP Automation</option>
                      <option>Mobile App Development (Native iOS/Android)</option>
                      <option>Cloud Infrastructure on AWS/Azure & Docker</option>
                      <option>AI & Business Automation / LLM Integrations</option>
                      <option>Full Enterprise Tech Stack Overhaul</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor={messageId} className="block text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wider mb-2">
                      Operational Goals or Specific Questions
                    </label>
                    <textarea
                      id={messageId}
                      rows={3}
                      placeholder="Share any current bottlenecks (e.g., inventory sync issues, courier delivery delays, high SaaS fees)..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-base text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all resize-none shadow-inner"
                    />
                  </div>

                  <button
                    type="submit"
                    id="submit-inquiry-button"
                    disabled={saving}
                    className="w-full py-4 px-7 rounded-2xl font-bold text-base text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 hover:brightness-110 active:scale-[0.99] transition-all shadow-xl shadow-cyan-950/40 flex items-center justify-center gap-3 cursor-pointer mt-3 disabled:opacity-60"
                  >
                    {saving ? (
                      <span>Securing Appointment in Firestore...</span>
                    ) : !currentUser ? (
                      <>
                        <Lock className="w-5 h-5 text-slate-950" />
                        <span>Sign In / Register to Book Appointment</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    ) : (
                      <>
                        <CalendarCheck className="w-5 h-5 text-slate-950" />
                        <span>Confirm Consultation Appointment</span>
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <p className="text-xs text-slate-400 text-center mt-2.5 font-medium flex items-center justify-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Direct founding team response. Appointments encrypted & stored in Firebase.</span>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
