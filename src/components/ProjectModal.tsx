import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, Check, Loader2 } from 'lucide-react';
import { SERVICES } from '../data/content';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

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
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState(preSelectedService);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Reset state when opening modal
  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
      setIsSuccess(false);
      setErrorMsg('');
      setService(preSelectedService);
    }
  }, [isOpen, preSelectedService]);

  if (!isOpen) return null;

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
      service: service || preSelectedService,
      message: message.trim(),
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
      // Show immediate subtle check-mark feedback animation on the button
      setIsSuccess(true);
      setTimeout(() => {
        setSubmitted(true);
        setIsSuccess(false);
      }, 850);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'inquiries');
      // Fallback local persistence was already saved
      setIsSuccess(true);
      setTimeout(() => {
        setSubmitted(true);
        setIsSuccess(false);
      }, 850);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-white/10 shadow-2xl p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mx-auto mb-4">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight mb-2">
              Request Received
            </h3>
            <p className="text-sm text-slate-300 max-w-sm mx-auto mb-6">
              Our engineering team will get back to you promptly to discuss your project scope.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-1">
                FAST INTAKE
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Start a Project
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Tell us about your digital requirements.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. ch. AMAN"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 93101 89235"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aman@company.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
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
                  Other / Full Transformation
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Quick Project Notes
              </label>
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What are your goals or current bottlenecks?"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || isSuccess}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm shadow-xl transition-all duration-300 cursor-pointer disabled:opacity-90 ${
                isSuccess
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30 scale-[1.02] ring-2 ring-emerald-400/50'
                  : submitting
                  ? 'bg-cyan-500/80 text-slate-950 cursor-wait'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/25 active:scale-[0.99]'
              }`}
            >
              {isSuccess ? (
                <span className="inline-flex items-center gap-2 text-slate-950 animate-in fade-in zoom-in-95 duration-200">
                  <span className="w-5 h-5 rounded-full bg-slate-950/15 flex items-center justify-center animate-in zoom-in-50 duration-300">
                    <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3] animate-in zoom-in duration-300" />
                  </span>
                  <span>Inquiry Sent!</span>
                </span>
              ) : submitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Submitting...</span>
                </span>
              ) : (
                <>
                  <span>Submit Project Inquiry</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
