import React, { useState } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';
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
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      setErrorMsg('Please enter your name and contact phone number.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      await addDoc(collection(db, 'inquiries'), {
        name: fullName.trim(),
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        service: service || preSelectedService,
        message: message.trim(),
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
                placeholder="e.g. Aman Pal"
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
                  placeholder="+91 99903 66072"
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
                  placeholder="aman@example.com"
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
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <span>Submitting...</span>
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
